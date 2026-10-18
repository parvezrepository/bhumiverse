"""
Admin API for BHUMIVerse.
Provides metrics, case review actions (Approve, Reject, Escalate, Request Info),
audit trail inspection, and global network graph.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
import uuid
from datetime import datetime
from backend.app.models.schemas import (
    CaseReviewActionRequest,
    CaseReviewRecord,
    AuditEvent,
    NetworkGraphData,
    GraphNode,
    GraphEdge
)
from backend.app.services.repository import repo
from backend.app.services.audit_service import AuditService
from backend.app.services.graph_builder import GraphBuilder

router = APIRouter(prefix="/admin", tags=["Admin Workflow"])


@router.get("/metrics")
def get_admin_metrics() -> Dict[str, Any]:
    """
    Computes live dashboard statistics directly from current database records.
    """
    cases = repo.get_all_cases()
    total_cases = len(cases)
    pending_reviews = sum(1 for c in cases if c.status in ("submitted", "under_review"))
    double_selling_conflicts = sum(
        1 for c in cases
        if any(f.rule_id == "RULE_B_DOUBLE_SELLING" for f in c.findings)
    )
    reg_mutation_mismatches = sum(
        1 for c in cases
        if any(f.rule_id == "RULE_C_REG_MUTATION_MISMATCH" and f.severity in ("high", "medium") for f in c.findings)
    )
    incomplete_data = sum(
        1 for c in cases
        if any(f.rule_id == "RULE_E_MISSING_CRITICAL_FIELDS" for f in c.findings)
    )
    info_requested = sum(1 for c in cases if c.status == "info_requested")
    high_risk_cases = sum(1 for c in cases if c.risk_level == "high")

    return {
        "total_cases": total_cases,
        "pending_reviews": pending_reviews,
        "double_selling_conflicts": double_selling_conflicts,
        "reg_mutation_mismatches": reg_mutation_mismatches,
        "incomplete_data_cases": incomplete_data,
        "info_requested_cases": info_requested,
        "high_risk_cases": high_risk_cases,
        "approved_cases": sum(1 for c in cases if c.status == "approved"),
        "rejected_cases": sum(1 for c in cases if c.status == "rejected"),
        "escalated_cases": sum(1 for c in cases if c.status == "escalated")
    }


@router.post("/cases/{case_id}/review")
def review_case(case_id: str, req: CaseReviewActionRequest):
    """
    Executes administrative case review action.
    Updates case status, logs actor and reason, and appends to immutable audit trail.
    """
    case = repo.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    # Status mapping
    status_map = {
        "mark_reviewed": "under_review",
        "approve_workflow": "approved",
        "reject_workflow": "rejected",
        "request_more_info": "info_requested",
        "escalate": "escalated"
    }

    if req.action not in status_map:
        raise HTTPException(status_code=400, detail=f"Invalid review action '{req.action}'.")

    new_status = status_map[req.action]
    old_status = case.status
    case.status = new_status
    case.updated_at = datetime.now()

    review_record = CaseReviewRecord(
        id=str(uuid.uuid4()),
        case_id=case_id,
        reviewer_name="Admin Reviewer (Authorized Land Officer)",
        action=req.action,
        decision_reason=req.decision_reason,
        internal_notes=req.internal_notes,
        created_at=datetime.now()
    )
    case.reviews.append(review_record)

    AuditService.record_event(
        event_type="ADMIN_CASE_REVIEW_ACTION",
        details={
            "action": req.action,
            "old_status": old_status,
            "new_status": new_status,
            "reason": req.decision_reason,
            "internal_notes": req.internal_notes
        },
        case_id=case_id,
        actor_email="admin@bhumiverse.internal"
    )

    return {
        "message": f"Case status updated to '{new_status}'.",
        "case_id": case_id,
        "new_status": new_status,
        "review": review_record
    }


@router.get("/audit-logs", response_model=List[AuditEvent])
def get_audit_logs(limit: int = 100):
    """
    Returns the append-only audit trail logs.
    """
    return AuditService.get_all_events(limit=limit)


@router.get("/graph/global", response_model=NetworkGraphData)
def get_global_network_graph():
    """
    Builds aggregated multi-case network graph across all seed cases to display cross-case fraud relationships.
    """
    all_nodes: Dict[str, GraphNode] = {}
    all_edges: List[GraphEdge] = []

    # Aggregate first 5 prominent cases including double-selling
    sample_cases = repo.get_all_cases()[:6]
    for c in sample_cases:
        c_graph = GraphBuilder.build_case_graph(c, c.findings)
        for n in c_graph.nodes:
            all_nodes[n.id] = n
        for e in c_graph.edges:
            all_edges.append(e)

    return NetworkGraphData(
        nodes=list(all_nodes.values()),
        edges=all_edges
    )
