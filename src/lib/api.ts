import { 
  CaseDetail, 
  UserProfile, 
  AuditEvent, 
  SmartDocumentDiffResponse, 
  NetworkGraphData, 
  ExplainableFraudRadar,
  DocumentItem
} from './types';
import { INITIAL_CASES, DEMO_PROFILES, INITIAL_AUDIT_LOGS } from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// In-memory local state cache for instant offline fallback
let localCases: CaseDetail[] = [...INITIAL_CASES];
let localAuditLogs: AuditEvent[] = [...INITIAL_AUDIT_LOGS];
let currentRole: 'citizen' | 'admin' = 'citizen';

export const api = {
  getRole: (): 'citizen' | 'admin' => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bhumiverse_role');
      if (stored === 'admin' || stored === 'citizen') return stored;
    }
    return currentRole;
  },

  setRole: (role: 'citizen' | 'admin') => {
    currentRole = role;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bhumiverse_role', role);
    }
  },

  signUp: async (data: { email: string; full_name: string; password?: string }): Promise<UserProfile> => {
    try {
      const res = await fetch(`${API_BASE}/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          full_name: data.full_name,
          password: data.password || 'Password123!'
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend sign-up endpoint error:', e);
    }
    return {
      id: 'citizen-' + Date.now(),
      email: data.email,
      full_name: data.full_name,
      role: 'citizen',
      is_verified: true,
      created_at: new Date().toISOString()
    };
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    const role = api.getRole();
    try {
      const res = await fetch(`${API_BASE}/auth/me?role=${role}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }
    return DEMO_PROFILES[role];
  },

  getCases: async (filters?: { status?: string; risk_level?: string; search?: string }): Promise<CaseDetail[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.risk_level) params.set('risk_level', filters.risk_level);
      if (filters?.search) params.set('search', filters.search);

      const res = await fetch(`${API_BASE}/cases?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      // offline fallback
    }

    let result = [...localCases];
    if (filters?.status) {
      result = result.filter(c => c.status.toLowerCase() === filters.status?.toLowerCase());
    }
    if (filters?.risk_level) {
      result = result.filter(c => c.risk_level.toLowerCase() === filters.risk_level?.toLowerCase());
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(s) || 
        c.tracking_id.toLowerCase().includes(s) ||
        (c.mouza || '').toLowerCase().includes(s)
      );
    }
    return result;
  },

  getCase: async (id: string): Promise<CaseDetail | null> => {
    try {
      const res = await fetch(`${API_BASE}/cases/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }
    const found = localCases.find(c => c.id === id || c.tracking_id.toLowerCase() === id.toLowerCase());
    return found || null;
  },

  createCase: async (payload: {
    title: string;
    description?: string;
    district: string;
    upazila: string;
    mouza: string;
    dag_no?: string;
    khatian_no?: string;
    deed_no?: string;
    land_area?: number;
    land_area_unit?: string;
  }): Promise<CaseDetail> => {
    try {
      const res = await fetch(`${API_BASE}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }

    const newCaseNum = localCases.length + 1;
    const trackingId = `BV-2026-${String(newCaseNum).padStart(4, '0')}`;
    const newCase: CaseDetail = {
      id: `case-local-${Date.now()}`,
      tracking_id: trackingId,
      user_id: DEMO_PROFILES.citizen.id,
      title: payload.title,
      description: payload.description || 'Citizen submitted verification case',
      district: payload.district,
      upazila: payload.upazila,
      mouza: payload.mouza,
      plot_khatian_summary: `Dag ${payload.dag_no || 'N/A'}, Khatian ${payload.khatian_no || 'N/A'}`,
      status: 'submitted',
      risk_level: 'low',
      is_demo: false,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      documents: [],
      land_records: [
        {
          case_id: `case-local-${Date.now()}`,
          district: payload.district,
          upazila: payload.upazila,
          mouza: payload.mouza,
          dag_no: payload.dag_no || 'N/A',
          khatian_no: payload.khatian_no || 'N/A',
          recorded_land_area_decimal: payload.land_area
        }
      ],
      transactions: [],
      findings: [],
      reviews: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          event_date: new Date().toISOString().split('T')[0],
          event_type: 'deed_executed',
          title: 'Case Verification Submitted',
          description: `Applicant created case for ${payload.mouza}, Dag ${payload.dag_no || 'N/A'}.`,
          record_type: 'Document'
        }
      ]
    };
    localCases.unshift(newCase);
    return newCase;
  },

  getRadar: async (caseId: string): Promise<ExplainableFraudRadar | null> => {
    try {
      const res = await fetch(`${API_BASE}/cases/${caseId}/analysis/radar`);
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }
    const c = localCases.find(item => item.id === caseId || item.tracking_id === caseId);
    return c?.radar || {
      case_id: caseId,
      tracking_id: c?.tracking_id || 'BV-UNKNOWN',
      overall_risk_level: c?.risk_level || 'low',
      risk_score_numeric: c?.risk_level === 'high' ? 85 : 15,
      findings_count: c?.findings.length || 0,
      critical_conflicts_count: c?.findings.filter(f => f.severity === 'high').length || 0,
      findings: c?.findings || [],
      recommended_checks: ['Verify revenue records and physical possession before conveyance.'],
      disclaimer: 'This assessment is an automated risk screening aid for prioritization only.'
    };
  },

  getDiff: async (caseId: string, doc1Id?: string, doc2Id?: string): Promise<SmartDocumentDiffResponse> => {
    try {
      const res = await fetch(`${API_BASE}/cases/${caseId}/analysis/diff?doc1_id=${doc1Id || ''}&doc2_id=${doc2Id || ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }
    const c = localCases.find(item => item.id === caseId || item.tracking_id === caseId);
    return {
      case_id: caseId,
      doc1_id: 'doc-1',
      doc1_name: c?.documents[0]?.file_name || 'Primary Document',
      doc2_id: 'doc-2',
      doc2_name: c?.documents[1]?.file_name || 'Secondary Record',
      comparisons: [
        { field_name: 'dag_no', label_en: 'Dag / Plot Number', label_bn: 'দাগ নম্বর', doc1_value: '405', doc2_value: '405', status: 'match', confidence1: 0.98, confidence2: 0.96 },
        { field_name: 'khatian_no', label_en: 'Khatian Number', label_bn: 'খতিয়ান নম্বর', doc1_value: '202', doc2_value: '202', status: 'match', confidence1: 0.97, confidence2: 0.95 },
        { field_name: 'buyer_name', label_en: 'Buyer / Purchaser', label_bn: 'ক্রেতা / গ্রহীতা', doc1_value: 'Kabir Ahmed', doc2_value: 'Tariqul Islam', status: 'conflict', confidence1: 0.96, confidence2: 0.95, notes: 'Discrepancy: Two distinct individuals listed on same parcel sale.' },
        { field_name: 'land_area', label_en: 'Land Area', label_bn: 'জমির পরিমাণ', doc1_value: '8.0 decimal', doc2_value: '8.0 decimal', status: 'match', confidence1: 0.95, confidence2: 0.95 },
        { field_name: 'deed_no', label_en: 'Deed Number', label_bn: 'দলিল নম্বর', doc1_value: '5510/2020', doc2_value: '9104/2023', status: 'conflict', confidence1: 0.96, confidence2: 0.96, notes: 'Separate deed serial registrations.' }
      ],
      summary: 'Comparison revealed 2 conflicting fields indicating multiple unrevoked conveyances.'
    };
  },

  getNetworkGraph: async (caseId: string): Promise<NetworkGraphData> => {
    try {
      const res = await fetch(`${API_BASE}/cases/${caseId}/analysis/graph`);
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }
    // High-fidelity fallback graph
    return {
      nodes: [
        { id: 'case_root', label: 'Case BV-2026-0002', type: 'case', severity: 'high' },
        { id: 'plot_405', label: 'Plot Dag-405 (Joar Sahara)', type: 'plot', severity: 'info' },
        { id: 'doc_5510', label: 'Deed 5510/2020 (Kabir)', type: 'document', severity: 'low' },
        { id: 'doc_9104', label: 'Deed 9104/2023 (Tariq)', type: 'document', severity: 'low' },
        { id: 'buyer_kabir', label: 'Buyer: Kabir Ahmed', type: 'buyer', severity: 'info' },
        { id: 'buyer_tariq', label: 'Buyer: Tariqul Islam', type: 'buyer', severity: 'info' },
        { id: 'seller_mostafiz', label: 'Seller: Mostafizur Rahman', type: 'seller', severity: 'high' },
      ],
      edges: [
        { source: 'case_root', target: 'plot_405', label: 'linked_case' },
        { source: 'case_root', target: 'doc_5510', label: 'contains_document' },
        { source: 'case_root', target: 'doc_9104', label: 'contains_document' },
        { source: 'doc_5510', target: 'plot_405', label: 'refers_to_plot' },
        { source: 'doc_9104', target: 'plot_405', label: 'refers_to_plot' },
        { source: 'seller_mostafiz', target: 'doc_5510', label: 'executed_by' },
        { source: 'seller_mostafiz', target: 'doc_9104', label: 'executed_by' },
        { source: 'doc_5510', target: 'buyer_kabir', label: 'transferred_to' },
        { source: 'doc_9104', target: 'buyer_tariq', label: 'transferred_to' },
        { source: 'buyer_kabir', target: 'buyer_tariq', label: 'conflicting_claim', is_conflict: true }
      ]
    };
  },

  adminReviewCase: async (caseId: string, action: string, reason: string, notes?: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/cases/${caseId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, decision_reason: reason, internal_notes: notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }

    const c = localCases.find(item => item.id === caseId || item.tracking_id === caseId);
    if (c) {
      const map: Record<string, any> = {
        mark_reviewed: 'under_review',
        approve_workflow: 'approved',
        reject_workflow: 'rejected',
        request_more_info: 'info_requested',
        escalate: 'escalated'
      };
      c.status = map[action] || c.status;
      c.reviews.push({
        id: `rev-${Date.now()}`,
        case_id: c.id,
        reviewer_name: 'Admin Reviewer',
        action: action as any,
        decision_reason: reason,
        internal_notes: notes,
        created_at: new Date().toISOString()
      });
      localAuditLogs.unshift({
        id: `audit-${Date.now()}`,
        case_id: c.id,
        actor_email: 'admin@bhumiverse.internal',
        event_type: 'ADMIN_CASE_REVIEW_ACTION',
        details: { action, reason, notes },
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
      });
    }
    return { success: true };
  },

  getAuditLogs: async (): Promise<AuditEvent[]> => {
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs`);
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }
    return localAuditLogs;
  },

  getAdminMetrics: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/metrics`);
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }
    const cases = localCases;
    return {
      total_cases: cases.length,
      pending_reviews: cases.filter(c => c.status === 'submitted' || c.status === 'under_review').length,
      double_selling_conflicts: cases.filter(c => c.findings.some(f => f.rule_id === 'RULE_B_DOUBLE_SELLING')).length,
      reg_mutation_mismatches: cases.filter(c => c.findings.some(f => f.rule_id === 'RULE_C_REG_MUTATION_MISMATCH' && f.severity === 'high')).length,
      incomplete_data_cases: cases.filter(c => c.findings.some(f => f.rule_id === 'RULE_E_MISSING_CRITICAL_FIELDS')).length,
      info_requested_cases: cases.filter(c => c.status === 'info_requested').length,
      high_risk_cases: cases.filter(c => c.risk_level === 'high').length,
      approved_cases: cases.filter(c => c.status === 'approved').length,
      rejected_cases: cases.filter(c => c.status === 'rejected').length,
      escalated_cases: cases.filter(c => c.status === 'escalated').length
    };
  }
};
