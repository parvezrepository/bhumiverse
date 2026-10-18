"""
Reports API for BHUMIVerse.
Generates and streams downloadable PDF risk reports.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from backend.app.services.repository import repo
from backend.app.services.fraud_engine import FraudDetectionEngine
from backend.app.services.pdf_generator import PDFReportGenerator
from backend.app.services.audit_service import AuditService

router = APIRouter(prefix="/cases/{case_id}/report", tags=["Reports"])


@router.get("/pdf")
def download_pdf_report(case_id: str):
    """
    Renders and streams downloadable PDF Risk Report with SHA-256 hashes,
    rule findings, evidence references, and legal disclaimer.
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

    pdf_bytes = PDFReportGenerator.generate_report_bytes(case, radar)

    AuditService.record_event(
        event_type="PDF_REPORT_DOWNLOADED",
        details={"tracking_id": case.tracking_id, "size_bytes": len(pdf_bytes)},
        case_id=case_id,
        actor_email="system@bhumiverse.internal"
    )

    filename = f"BHUMIVerse_Risk_Report_{case.tracking_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=\"{filename}\"",
            "Cache-Control": "no-cache"
        }
    )
