"""
Analysis API for BHUMIVerse.
Endpoints for:
1. Explainable Fraud Radar
2. Smart Document Diff
3. Fraud Network Graph
4. Land Transaction Timeline
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from backend.app.models.schemas import (
    ExplainableFraudRadar,
    SmartDocumentDiffResponse,
    DiffFieldComparison,
    NetworkGraphData,
    TimelineEvent
)
from backend.app.services.repository import repo
from backend.app.services.fraud_engine import FraudDetectionEngine
from backend.app.services.graph_builder import GraphBuilder
from backend.app.services.normalizer import (
    normalize_identifier,
    are_names_plausibly_different
)

router = APIRouter(prefix="/cases/{case_id}/analysis", tags=["Analysis & Visualizations"])


@router.get("/radar", response_model=ExplainableFraudRadar)
def get_case_fraud_radar(case_id: str):
    """
    Returns explainable fraud radar and evidence-backed findings for case.
    """
    case = repo.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    radar = FraudDetectionEngine.evaluate_case(
        case.id,
        case.tracking_id,
        case.documents,
        case.land_records,
        case.transactions,
        all_system_documents=repo.get_all_documents(),
        all_system_transactions=repo.get_all_transactions()
    )
    return radar


@router.get("/diff", response_model=SmartDocumentDiffResponse)
def get_document_diff(
    case_id: str,
    doc1_id: Optional[str] = Query(None),
    doc2_id: Optional[str] = Query(None)
):
    """
    Performs smart side-by-side field comparison between two documents.
    Color-codes matching, conflicting, missing, and low-confidence fields.
    """
    case = repo.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    if len(case.documents) < 2:
        # If fewer than 2 docs, synthesize comparative preview with case record
        d1 = case.documents[0] if case.documents else None
        d1_id = d1.id if d1 else "doc-1"
        d1_name = d1.file_name if d1 else "Submitted Document"
        d2_id = "rec-khatian"
        d2_name = "Land Office Record (Comparative Reference)"
    else:
        d1 = next((d for d in case.documents if d.id == doc1_id), case.documents[0])
        d2 = next((d for d in case.documents if d.id == doc2_id and d.id != d1.id), case.documents[1])
        d1_id, d1_name = d1.id, d1.file_name
        d2_id, d2_name = d2.id, d2.file_name

    fields_to_compare = [
        ("dag_no", "Dag / Plot Number", "দাগ নম্বর"),
        ("khatian_no", "Khatian / Porcha Number", "খতিয়ান নম্বর"),
        ("mouza", "Mouza Name", "মৌজার নাম"),
        ("land_area", "Land Area", "জমির পরিমাণ"),
        ("buyer_name", "Buyer / Purchaser", "ক্রেতা / গ্রহীতা"),
        ("seller_name", "Seller / Transferor", "বিক্রেতা / দাতা"),
        ("deed_no", "Deed Serial Number", "দলিল নম্বর"),
        ("transaction_date", "Transaction Date", "সম্পাদনের তারিখ"),
    ]

    comparisons: List[DiffFieldComparison] = []
    conflict_count = 0

    for fname, lbl_en, lbl_bn in fields_to_compare:
        val1 = None
        conf1 = 1.0
        val2 = None
        conf2 = 1.0

        if d1:
            f1 = next((f for f in d1.extracted_fields if f.field_name == fname), None)
            if f1:
                val1 = f1.normalized_value or f1.original_value
                conf1 = f1.confidence

        if len(case.documents) >= 2 and d2:
            f2 = next((f for f in d2.extracted_fields if f.field_name == fname), None)
            if f2:
                val2 = f2.normalized_value or f2.original_value
                conf2 = f2.confidence
        else:
            # Fallback to case land record reference
            if fname == "dag_no":
                val2 = case.land_records[0].dag_no if case.land_records else None
            elif fname == "khatian_no":
                val2 = case.land_records[0].khatian_no if case.land_records else None
            elif fname == "mouza":
                val2 = case.mouza

        # Status determination
        if not val1 and not val2:
            status = "missing"
            notes = "Field absent in both documents."
        elif not val1 or not val2:
            status = "missing"
            notes = f"Field missing in {'Document 1' if not val1 else 'Document 2'}."
        elif conf1 < 0.70 or conf2 < 0.70:
            status = "uncertain"
            notes = "OCR confidence is low on one or both values; manual verification advised."
        elif normalize_identifier(val1) == normalize_identifier(val2):
            status = "match"
            notes = "Exact normalized value correspondence."
        else:
            status = "conflict"
            conflict_count += 1
            notes = f"Discrepancy detected: '{val1}' vs '{val2}'."

        comparisons.append(DiffFieldComparison(
            field_name=fname,
            label_en=lbl_en,
            label_bn=lbl_bn,
            doc1_value=val1,
            doc2_value=val2,
            status=status,
            confidence1=conf1,
            confidence2=conf2,
            notes=notes
        ))

    summary = (
        f"Compared {len(comparisons)} primary fields. "
        f"{conflict_count} conflicting field(s) identified requiring authorized reviewer examination."
    ) if conflict_count > 0 else "All compared common fields align consistently without conflicts."

    return SmartDocumentDiffResponse(
        case_id=case_id,
        doc1_id=d1_id,
        doc1_name=d1_name,
        doc2_id=d2_id,
        doc2_name=d2_name,
        comparisons=comparisons,
        summary=summary
    )


@router.get("/graph", response_model=NetworkGraphData)
def get_case_network_graph(case_id: str):
    """
    Returns entity network graph connecting Case, Plots, Documents, Transactions, and Personas.
    """
    case = repo.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    findings = case.findings or []
    graph_data = GraphBuilder.build_case_graph(case, findings)
    return graph_data


@router.get("/timeline", response_model=List[TimelineEvent])
def get_case_timeline(case_id: str):
    """
    Returns chronological transaction and review timeline with gaps and alerts clearly annotated.
    """
    case = repo.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    return case.timeline or []
