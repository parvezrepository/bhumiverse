"""
Case Management API for BHUMIVerse.
Handles listing, retrieval, and submission of land verification cases.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime, date
from backend.app.models.schemas import (
    CaseDetailResponse,
    CaseCreateRequest,
    LandRecord,
    TransactionRecord,
    TimelineEvent
)
from backend.app.services.repository import repo
from backend.app.services.fraud_engine import FraudDetectionEngine
from backend.app.services.audit_service import AuditService
from backend.app.services.normalizer import normalize_numerals, normalize_land_area

router = APIRouter(prefix="/cases", tags=["Cases"])


@router.get("", response_model=List[CaseDetailResponse])
def list_cases(
    status: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50)
):
    """
    Lists verification cases with optional filters.
    """
    cases = repo.get_all_cases()

    if status:
        cases = [c for c in cases if c.status.lower() == status.lower()]
    if risk_level:
        cases = [c for c in cases if c.risk_level.lower() == risk_level.lower()]
    if search:
        s = search.lower()
        cases = [
            c for c in cases
            if s in c.title.lower()
            or s in c.tracking_id.lower()
            or s in (c.mouza or "").lower()
            or s in (c.district or "").lower()
        ]

    # Sort newest first
    cases.sort(key=lambda x: x.submitted_at, reverse=True)
    return cases[:limit]


@router.get("/{case_id}", response_model=CaseDetailResponse)
def get_case(case_id: str):
    """
    Fetches full case details including extracted fields, findings radar, and timeline.
    """
    case = repo.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Verification case not found.")

    # Re-evaluate live radar with current repository context
    radar = FraudDetectionEngine.evaluate_case(
        case.id,
        case.tracking_id,
        case.documents,
        case.land_records,
        case.transactions,
        all_system_documents=repo.get_all_documents(),
        all_system_transactions=repo.get_all_transactions()
    )
    case.radar = radar
    case.findings = radar.findings
    case.risk_level = radar.overall_risk_level

    return case


@router.post("", response_model=CaseDetailResponse)
def create_case(req: CaseCreateRequest):
    """
    Creates a new land verification case and initiates automated rule-based analysis.
    """
    case_num = len(repo.cases) + 1
    tracking_id = f"BV-2026-{case_num:04d}"
    case_id = str(uuid.uuid4())
    now = datetime.now()

    # Parse and normalize land area
    norm_area = normalize_land_area(req.land_area, req.land_area_unit)

    # Initial land record
    land_rec = LandRecord(
        id=str(uuid.uuid4()),
        case_id=case_id,
        district=req.district.strip().title(),
        upazila=req.upazila.strip().title(),
        mouza=req.mouza.strip().title(),
        khatian_type="RS",
        khatian_no=normalize_numerals(req.khatian_no) if req.khatian_no else "UNKNOWN",
        dag_no=normalize_numerals(req.dag_no) if req.dag_no else "UNKNOWN",
        recorded_land_area_decimal=norm_area["decimals"],
        recorded_land_area_sqft=norm_area["sqft"],
        deed_no=req.deed_no
    )

    transactions = []
    if req.deed_no:
        transactions.append(TransactionRecord(
            id=str(uuid.uuid4()),
            case_id=case_id,
            plot_identifier=f"{req.district.upper()}|{req.upazila.upper()}|{req.mouza.upper()}|DAG-{normalize_numerals(req.dag_no)}",
            deed_no=req.deed_no,
            transaction_type="Submitted Record"
        ))

    timeline = [
        TimelineEvent(
            id=str(uuid.uuid4()),
            event_date=str(now.date()),
            event_type="deed_executed",
            title="Case Verification Submitted",
            description=f"Applicant created case for {req.mouza}, Dag {req.dag_no or 'N/A'}.",
            record_type="Document"
        )
    ]

    # Evaluate initial radar
    radar = FraudDetectionEngine.evaluate_case(
        case_id,
        tracking_id,
        [],
        [land_rec],
        transactions,
        all_system_documents=repo.get_all_documents(),
        all_system_transactions=repo.get_all_transactions()
    )

    new_case = CaseDetailResponse(
        id=case_id,
        tracking_id=tracking_id,
        user_id="citizen-demo-id",
        title=req.title,
        description=req.description or "Citizen submitted verification case",
        district=req.district,
        upazila=req.upazila,
        mouza=req.mouza,
        plot_khatian_summary=f"Dag {req.dag_no or 'N/A'}, Khatian {req.khatian_no or 'N/A'}",
        status="submitted",
        risk_level=radar.overall_risk_level,
        is_demo=False,
        submitted_at=now,
        updated_at=now,
        documents=[],
        land_records=[land_rec],
        transactions=transactions,
        findings=radar.findings,
        reviews=[],
        timeline=timeline,
        radar=radar
    )

    repo.add_case(new_case)

    AuditService.record_event(
        event_type="CASE_CREATED",
        details={
            "tracking_id": tracking_id,
            "district": req.district,
            "mouza": req.mouza,
            "dag_no": req.dag_no
        },
        case_id=case_id,
        actor_email="citizen@bhumiverse.internal"
    )

    return new_case
