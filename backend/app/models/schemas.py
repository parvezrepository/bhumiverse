"""
Pydantic Schemas and Domain Models for BHUMIVerse.
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, EmailStr


# ============================================================================
# Enums and Constants
# ============================================================================
class RoleEnum:
    CITIZEN = "citizen"
    ADMIN = "admin"


class CaseStatusEnum:
    SUBMITTED = "submitted"
    PROCESSING = "processing"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    INFO_REQUESTED = "info_requested"
    ESCALATED = "escalated"


class RiskLevelEnum:
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    INSUFFICIENT_DATA = "insufficient_data"


class SeverityEnum:
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class DocCategoryEnum:
    DEED = "deed"
    KHATIAN_PORCHA = "khatian_porcha"
    MUTATION_RECORD = "mutation_record"
    TAX_RECEIPT = "tax_receipt"
    OTHER = "other_supporting"


# ============================================================================
# Profile & Auth Schemas
# ============================================================================
class ProfileBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = RoleEnum.CITIZEN
    nid_mask: Optional[str] = "NID-XXXX-XXXX"
    phone_mask: Optional[str] = "+880 1XXX-XXXXXX"
    is_verified: bool = False


class ProfileCreate(ProfileBase):
    password: str


class ProfileResponse(ProfileBase):
    id: str
    created_at: datetime
    updated_at: datetime


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: ProfileResponse


# ============================================================================
# Document & Extracted Field Schemas
# ============================================================================
class BoundingBox(BaseModel):
    x: float
    y: float
    w: float
    h: float
    page: int = 1


class ExtractedField(BaseModel):
    id: Optional[str] = None
    field_name: str
    original_value: Optional[str] = None
    normalized_value: Optional[str] = None
    confidence: float = 0.85
    bounding_box: Optional[BoundingBox] = None
    is_manually_corrected: bool = False
    corrected_value: Optional[str] = None
    corrected_by: Optional[str] = None
    corrected_at: Optional[datetime] = None


class ExtractedFieldCorrection(BaseModel):
    field_name: str
    corrected_value: str
    reason: Optional[str] = "User verified manual correction"


class DocumentItem(BaseModel):
    id: str
    case_id: str
    file_name: str
    file_type: str
    file_size_bytes: int
    file_hash_sha256: str
    storage_path: str
    doc_category: str
    ocr_status: str
    raw_ocr_text: Optional[str] = None
    confidence_score: float = 0.0
    uploaded_at: datetime
    extracted_fields: List[ExtractedField] = []


# ============================================================================
# Land Records & Transactions
# ============================================================================
class LandRecord(BaseModel):
    id: Optional[str] = None
    case_id: str
    document_id: Optional[str] = None
    district: str
    upazila: str
    mouza: str
    khatian_type: str = "RS"
    khatian_no: str
    dag_no: str
    recorded_land_area_decimal: Optional[float] = None
    recorded_land_area_sqft: Optional[float] = None
    deed_no: Optional[str] = None
    deed_date: Optional[date] = None


class TransactionRecord(BaseModel):
    id: Optional[str] = None
    case_id: str
    plot_identifier: str
    transaction_date: Optional[date] = None
    registration_date: Optional[date] = None
    mutation_date: Optional[date] = None
    deed_no: Optional[str] = None
    buyer_name: Optional[str] = None
    seller_name: Optional[str] = None
    transaction_type: str = "Sale Deed"
    consideration_bdt: Optional[float] = None


# ============================================================================
# Findings & Evidence
# ============================================================================
class FindingEvidence(BaseModel):
    id: Optional[str] = None
    document_id: Optional[str] = None
    field_name: Optional[str] = None
    snippet: Optional[str] = None
    page_number: int = 1


class Finding(BaseModel):
    id: str
    case_id: str
    rule_id: str
    finding_type: str
    severity: str
    title: str
    explanation: str
    conflicting_values: Optional[Dict[str, Any]] = None
    recommended_action: str
    detected_at: datetime
    evidence: List[FindingEvidence] = []


# ============================================================================
# Case Models
# ============================================================================
class CaseCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    district: str
    upazila: str
    mouza: str
    khatian_no: Optional[str] = None
    dag_no: Optional[str] = None
    deed_no: Optional[str] = None
    transaction_date: Optional[str] = None
    land_area: Optional[float] = None
    land_area_unit: Optional[str] = "decimal"


class CaseReviewActionRequest(BaseModel):
    action: str  # mark_reviewed, approve_workflow, reject_workflow, request_more_info, escalate
    decision_reason: str
    internal_notes: Optional[str] = None


class CaseReviewRecord(BaseModel):
    id: str
    case_id: str
    reviewer_name: str
    action: str
    decision_reason: str
    internal_notes: Optional[str] = None
    created_at: datetime


class AuditEvent(BaseModel):
    id: str
    case_id: Optional[str] = None
    actor_id: Optional[str] = None
    actor_email: Optional[str] = None
    event_type: str
    details: Dict[str, Any]
    ip_address: str = "127.0.0.1"
    created_at: datetime


# ============================================================================
# Timeline & Graph Schemas
# ============================================================================
class TimelineEvent(BaseModel):
    id: str
    event_date: Optional[str] = None
    event_type: str  # deed_executed, registration, mutation_applied, mutation_approved, conflict_alert
    title: str
    description: str
    reference_id: Optional[str] = None
    is_conflict: bool = False
    is_gap_warning: bool = False
    record_type: str  # Document, Transaction, Finding


class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # plot, document, transaction, buyer, seller, case
    severity: Optional[str] = "info"
    properties: Dict[str, Any] = {}


class GraphEdge(BaseModel):
    source: str
    target: str
    label: str  # refers_to_plot, related_document, conflicting_transaction, same_identifier, linked_case
    is_conflict: bool = False


class NetworkGraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


# ============================================================================
# Diff & Radar Schemas
# ============================================================================
class DiffFieldComparison(BaseModel):
    field_name: str
    label_en: str
    label_bn: str
    doc1_value: Optional[str] = None
    doc2_value: Optional[str] = None
    status: str  # match, conflict, missing, uncertain
    confidence1: float = 1.0
    confidence2: float = 1.0
    notes: Optional[str] = None


class SmartDocumentDiffResponse(BaseModel):
    case_id: str
    doc1_id: str
    doc1_name: str
    doc2_id: str
    doc2_name: str
    comparisons: List[DiffFieldComparison]
    summary: str


class ExplainableFraudRadar(BaseModel):
    case_id: str
    tracking_id: str
    overall_risk_level: str  # low, medium, high, insufficient_data
    risk_score_numeric: int  # 0 to 100 indicator (prioritization metric only)
    findings_count: int
    critical_conflicts_count: int
    findings: List[Finding]
    recommended_checks: List[str]
    disclaimer: str = (
        "This assessment is an automated risk screening aid for prioritization only. "
        "It does not constitute an official ownership certificate, legal determination, or proof of fraud. "
        "Final determination requires human review by an authorized land official."
    )


# ============================================================================
# Full Case Detail Response
# ============================================================================
class CaseDetailResponse(BaseModel):
    id: str
    tracking_id: str
    user_id: str
    title: str
    description: Optional[str] = None
    district: Optional[str] = None
    upazila: Optional[str] = None
    mouza: Optional[str] = None
    plot_khatian_summary: Optional[str] = None
    status: str
    risk_level: str
    is_demo: bool = False
    submitted_at: datetime
    updated_at: datetime
    documents: List[DocumentItem] = []
    land_records: List[LandRecord] = []
    transactions: List[TransactionRecord] = []
    findings: List[Finding] = []
    reviews: List[CaseReviewRecord] = []
    timeline: List[TimelineEvent] = []
    radar: Optional[ExplainableFraudRadar] = None
