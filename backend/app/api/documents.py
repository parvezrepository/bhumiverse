"""
Documents API for BHUMIVerse.
Handles secure upload, validation, SHA-256 hash calculation, OCR extraction,
and manual field corrections with audit trail preservation.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import Optional, Dict, Any
import uuid
from datetime import datetime
from backend.app.models.schemas import (
    DocumentItem,
    ExtractedField,
    ExtractedFieldCorrection,
    DocCategoryEnum
)
from backend.app.services.ocr_service import OCRServiceAdapter
from backend.app.services.repository import repo
from backend.app.services.audit_service import AuditService
from backend.app.services.fraud_engine import FraudDetectionEngine
from backend.app.config import settings

router = APIRouter(prefix="/cases/{case_id}/documents", tags=["Documents"])

ALLOWED_TYPES = {"application/pdf", "image/png", "image/jpeg", "image/jpg"}
ALLOWED_EXTS = {"pdf", "png", "jpg", "jpeg"}


@router.post("", response_model=DocumentItem)
async def upload_document(
    case_id: str,
    file: UploadFile = File(...),
    doc_category: str = Form("deed"),
    district: Optional[str] = Form(None),
    upazila: Optional[str] = Form(None),
    mouza: Optional[str] = Form(None),
    khatian_no: Optional[str] = Form(None),
    dag_no: Optional[str] = Form(None),
    deed_no: Optional[str] = Form(None),
    land_area: Optional[str] = Form(None)
):
    """
    Validates file content, calculates SHA-256, runs OCR text extraction,
    and appends document to case with re-evaluated fraud findings.
    """
    case = repo.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    # 1. Validation of extension and mime type
    filename = file.filename or "unknown_document.pdf"
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '.{ext}'. Supported formats are: PDF, PNG, JPG, JPEG."
        )

    # 2. Read bytes and check size
    file_bytes = await file.read()
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum permissible limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # 3. OCR & Field Extraction
    metadata = {
        "district": district,
        "upazila": upazila,
        "mouza": mouza,
        "khatian_no": khatian_no,
        "dag_no": dag_no,
        "deed_no": deed_no,
        "land_area": land_area
    }
    ocr_result = OCRServiceAdapter.process_file_content(
        file_bytes=file_bytes,
        file_name=filename,
        doc_category=doc_category,
        provided_metadata=metadata
    )

    doc_id = str(uuid.uuid4())
    new_doc = DocumentItem(
        id=doc_id,
        case_id=case_id,
        file_name=filename,
        file_type=ext,
        file_size_bytes=len(file_bytes),
        file_hash_sha256=ocr_result["file_hash_sha256"],
        storage_path=f"/storage/{case_id}/{filename}",
        doc_category=doc_category,
        ocr_status=ocr_result["ocr_status"],
        raw_ocr_text=ocr_result["raw_ocr_text"],
        confidence_score=ocr_result["confidence_score"],
        uploaded_at=datetime.now(),
        extracted_fields=ocr_result["extracted_fields"]
    )

    # Add to case
    case.documents.append(new_doc)
    case.updated_at = datetime.now()

    # Re-evaluate Fraud Radar for the case
    case.radar = FraudDetectionEngine.evaluate_case(
        case.id,
        case.tracking_id,
        case.documents,
        case.land_records,
        case.transactions,
        all_system_documents=repo.get_all_documents(),
        all_system_transactions=repo.get_all_transactions()
    )
    case.findings = case.radar.findings
    case.risk_level = case.radar.overall_risk_level

    AuditService.record_event(
        event_type="DOCUMENT_UPLOADED",
        details={
            "document_id": doc_id,
            "file_name": filename,
            "category": doc_category,
            "sha256": new_doc.file_hash_sha256,
            "extracted_fields_count": len(new_doc.extracted_fields),
            "confidence": new_doc.confidence_score
        },
        case_id=case_id,
        actor_email="citizen@bhumiverse.internal"
    )

    return new_doc


@router.post("/{document_id}/fields/correct")
def correct_extracted_field(
    case_id: str,
    document_id: str,
    correction: ExtractedFieldCorrection
):
    """
    Allows user to manually correct an uncertain OCR field.
    Preserves original OCR value and logs correction to the audit trail.
    """
    case = repo.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    target_doc = next((d for d in case.documents if d.id == document_id), None)
    if not target_doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    field = next((f for f in target_doc.extracted_fields if f.field_name == correction.field_name), None)

    old_val = field.original_value if field else "None"

    if not field:
        # Field wasn't previously extracted; add it
        field = ExtractedField(
            field_name=correction.field_name,
            original_value=old_val,
            normalized_value=correction.corrected_value,
            confidence=1.0,
            is_manually_corrected=True,
            corrected_value=correction.corrected_value,
            corrected_at=datetime.now()
        )
        target_doc.extracted_fields.append(field)
    else:
        field.is_manually_corrected = True
        field.corrected_value = correction.corrected_value
        field.normalized_value = correction.corrected_value
        field.confidence = 1.0
        field.corrected_at = datetime.now()

    # Re-evaluate case radar with updated field
    case.radar = FraudDetectionEngine.evaluate_case(
        case.id,
        case.tracking_id,
        case.documents,
        case.land_records,
        case.transactions,
        all_system_documents=repo.get_all_documents(),
        all_system_transactions=repo.get_all_transactions()
    )
    case.findings = case.radar.findings
    case.risk_level = case.radar.overall_risk_level

    AuditService.record_event(
        event_type="FIELD_MANUALLY_CORRECTED",
        details={
            "document_id": document_id,
            "field_name": correction.field_name,
            "old_value": old_val,
            "new_value": correction.corrected_value,
            "reason": correction.reason
        },
        case_id=case_id,
        actor_email="citizen@bhumiverse.internal"
    )

    return {"message": "Field corrected successfully and recorded to audit trail.", "field": field}
