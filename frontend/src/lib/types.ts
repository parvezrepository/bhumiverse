export type Role = 'citizen' | 'admin';

export type CaseStatus = 
  | 'submitted' 
  | 'processing' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'info_requested' 
  | 'escalated';

export type RiskLevel = 'low' | 'medium' | 'high' | 'insufficient_data';
export type Severity = 'info' | 'low' | 'medium' | 'high';
export type DocCategory = 'deed' | 'khatian_porcha' | 'mutation_record' | 'tax_receipt' | 'other_supporting';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  nid_mask?: string;
  phone_mask?: string;
  is_verified: boolean;
  created_at?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  page: number;
}

export interface ExtractedField {
  id?: string;
  field_name: string;
  original_value?: string;
  normalized_value?: string;
  confidence: number;
  bounding_box?: BoundingBox;
  is_manually_corrected?: boolean;
  corrected_value?: string;
  corrected_at?: string;
}

export interface DocumentItem {
  id: string;
  case_id: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  file_hash_sha256: string;
  storage_path: string;
  doc_category: DocCategory;
  ocr_status: 'pending' | 'processing' | 'completed' | 'failed' | 'manual_entry';
  raw_ocr_text?: string;
  confidence_score: number;
  uploaded_at: string;
  extracted_fields: ExtractedField[];
}

export interface LandRecord {
  id?: string;
  case_id: string;
  district: string;
  upazila: string;
  mouza: string;
  khatian_type?: string;
  khatian_no: string;
  dag_no: string;
  recorded_land_area_decimal?: number;
  recorded_land_area_sqft?: number;
  deed_no?: string;
}

export interface TransactionRecord {
  id?: string;
  case_id: string;
  plot_identifier: string;
  transaction_date?: string;
  registration_date?: string;
  mutation_date?: string;
  deed_no?: string;
  buyer_name?: string;
  seller_name?: string;
  transaction_type?: string;
  consideration_bdt?: number;
}

export interface FindingEvidence {
  id?: string;
  document_id?: string;
  field_name?: string;
  snippet?: string;
  page_number?: number;
}

export interface Finding {
  id: string;
  case_id: string;
  rule_id: string;
  finding_type: string;
  severity: Severity;
  title: string;
  explanation: string;
  conflicting_values?: Record<string, any>;
  recommended_action: string;
  detected_at: string;
  evidence?: FindingEvidence[];
}

export interface CaseReviewRecord {
  id: string;
  case_id: string;
  reviewer_name: string;
  action: 'mark_reviewed' | 'approve_workflow' | 'reject_workflow' | 'request_more_info' | 'escalate';
  decision_reason: string;
  internal_notes?: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  event_date?: string;
  event_type: 'deed_executed' | 'registration' | 'mutation_applied' | 'mutation_approved' | 'conflict_alert';
  title: string;
  description: string;
  reference_id?: string;
  is_conflict?: boolean;
  is_gap_warning?: boolean;
  record_type: string;
}

export interface ExplainableFraudRadar {
  case_id: string;
  tracking_id: string;
  overall_risk_level: RiskLevel;
  risk_score_numeric: number;
  findings_count: number;
  critical_conflicts_count: number;
  findings: Finding[];
  recommended_checks: string[];
  disclaimer: string;
}

export interface CaseDetail {
  id: string;
  tracking_id: string;
  user_id: string;
  title: string;
  description?: string;
  district?: string;
  upazila?: string;
  mouza?: string;
  plot_khatian_summary?: string;
  status: CaseStatus;
  risk_level: RiskLevel;
  is_demo: boolean;
  submitted_at: string;
  updated_at: string;
  documents: DocumentItem[];
  land_records: LandRecord[];
  transactions: TransactionRecord[];
  findings: Finding[];
  reviews: CaseReviewRecord[];
  timeline: TimelineEvent[];
  radar?: ExplainableFraudRadar;
}

export interface AuditEvent {
  id: string;
  case_id?: string;
  actor_id?: string;
  actor_email?: string;
  event_type: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'plot' | 'document' | 'transaction' | 'buyer' | 'seller' | 'case';
  severity?: Severity;
  properties?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  is_conflict?: boolean;
}

export interface NetworkGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DiffFieldComparison {
  field_name: string;
  label_en: string;
  label_bn: string;
  doc1_value?: string;
  doc2_value?: string;
  status: 'match' | 'conflict' | 'missing' | 'uncertain';
  confidence1: number;
  confidence2: number;
  notes?: string;
}

export interface SmartDocumentDiffResponse {
  case_id: string;
  doc1_id: string;
  doc1_name: string;
  doc2_id: string;
  doc2_name: string;
  comparisons: DiffFieldComparison[];
  summary: string;
}
