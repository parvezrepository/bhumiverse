-- ============================================================================
-- BHUMIVerse Database Schema (PostgreSQL / Supabase)
-- AI-Assisted Land Fraud Detection & Double-Selling Risk Analysis Platform
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users or standalone mock)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
    nid_mask VARCHAR(50) DEFAULT 'NID-XXXX-XXXX',
    phone_mask VARCHAR(50) DEFAULT '+880 1XXX-XXXXXX',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CASES
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. BV-2026-0012
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    district VARCHAR(100),
    upazila VARCHAR(100),
    mouza VARCHAR(100),
    plot_khatian_summary VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' 
        CHECK (status IN ('submitted', 'processing', 'under_review', 'approved', 'rejected', 'info_requested', 'escalated')),
    risk_level VARCHAR(50) NOT NULL DEFAULT 'insufficient_data'
        CHECK (risk_level IN ('low', 'medium', 'high', 'insufficient_data')),
    is_demo BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- pdf, png, jpg
    file_size_bytes BIGINT NOT NULL,
    file_hash_sha256 VARCHAR(64) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    doc_category VARCHAR(50) NOT NULL 
        CHECK (doc_category IN ('deed', 'khatian_porcha', 'mutation_record', 'tax_receipt', 'other_supporting')),
    ocr_status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed', 'manual_entry')),
    raw_ocr_text TEXT,
    confidence_score NUMERIC(5, 2) DEFAULT 0.00,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXTRACTED_FIELDS
CREATE TABLE IF NOT EXISTS public.extracted_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    original_value TEXT,
    normalized_value TEXT,
    confidence NUMERIC(5, 2) DEFAULT 0.00,
    bounding_box JSONB, -- {x, y, w, h, page}
    is_manually_corrected BOOLEAN DEFAULT FALSE,
    corrected_value TEXT,
    corrected_by UUID REFERENCES public.profiles(id),
    corrected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LAND_RECORDS (Structured Parcel Identity)
CREATE TABLE IF NOT EXISTS public.land_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100) NOT NULL,
    mouza VARCHAR(100) NOT NULL,
    khatian_type VARCHAR(50) DEFAULT 'RS', -- CS, SA, RS, BS, City Survey
    khatian_no VARCHAR(50) NOT NULL,
    dag_no VARCHAR(50) NOT NULL,
    recorded_land_area_decimal NUMERIC(10, 4),
    recorded_land_area_sqft NUMERIC(12, 2),
    deed_no VARCHAR(100),
    deed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    plot_identifier VARCHAR(200) NOT NULL, -- e.g. 'Dhaka|Gulshan|Baunia|RS-102|Dag-405'
    transaction_date DATE,
    registration_date DATE,
    mutation_date DATE,
    deed_no VARCHAR(100),
    buyer_name VARCHAR(255),
    seller_name VARCHAR(255),
    transaction_type VARCHAR(100) DEFAULT 'Sale Deed',
    consideration_bdt NUMERIC(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FINDINGS (Rule Detection Output)
CREATE TABLE IF NOT EXISTS public.findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    rule_id VARCHAR(50) NOT NULL, -- e.g. RULE_A_DUPLICATE_FILE, RULE_B_DOUBLE_SELLING
    finding_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'info')),
    title VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    conflicting_values JSONB, -- key-value conflicts
    recommended_action TEXT NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FINDING_EVIDENCE
CREATE TABLE IF NOT EXISTS public.finding_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finding_id UUID REFERENCES public.findings(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    field_name VARCHAR(100),
    snippet TEXT,
    page_number INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CASE_REVIEWS (Admin Decision Audit)
CREATE TABLE IF NOT EXISTS public.case_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id),
    action VARCHAR(50) NOT NULL CHECK (action IN ('mark_reviewed', 'approve_workflow', 'reject_workflow', 'request_more_info', 'escalate')),
    decision_reason TEXT NOT NULL,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDIT_EVENTS (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    details JSONB NOT NULL,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DEMO_DATASET_VERSIONS
CREATE TABLE IF NOT EXISTS public.demo_dataset_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_tag VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    case_count INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON public.cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_risk_level ON public.cases(risk_level);
CREATE INDEX IF NOT EXISTS idx_documents_case_id ON public.documents(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_hash ON public.documents(file_hash_sha256);
CREATE INDEX IF NOT EXISTS idx_land_records_plot ON public.land_records(district, upazila, mouza, dag_no);
CREATE INDEX IF NOT EXISTS idx_transactions_plot ON public.transactions(plot_identifier);
CREATE INDEX IF NOT EXISTS idx_findings_case_id ON public.findings(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_case_id ON public.audit_events(case_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can see own profile, admins can see all
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow public / backend signup insert on profiles
CREATE POLICY "Allow public insert on profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- Auto-create profile trigger on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'citizen'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Cases: Users see own cases; Admins see all
CREATE POLICY "Users can view own cases" ON public.cases
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin() OR is_demo = TRUE);

CREATE POLICY "Users can insert own cases" ON public.cases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins or owners can update cases" ON public.cases
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- Documents: Users see own documents; Admins see all
CREATE POLICY "Users view own documents" ON public.documents
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.cases WHERE cases.id = documents.case_id AND (cases.user_id = auth.uid() OR cases.is_demo = TRUE))
        OR public.is_admin()
    );

-- Audit events: Append-only! No updates or deletes allowed
CREATE POLICY "Users can read own case audit events" ON public.audit_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.cases WHERE cases.id = audit_events.case_id AND cases.user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "Anyone authenticated can insert audit events" ON public.audit_events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
