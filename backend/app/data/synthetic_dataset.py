"""
Synthetic Dataset Repository for BHUMIVerse.
Contains 20+ realistic, labeled synthetic cases illustrating every rule and edge case:
All records strictly tagged: "DEMO DATA — NOT AN OFFICIAL LAND RECORD".
No real citizens' personal data or government records are used.
"""

import uuid
from datetime import datetime, date, timedelta
from typing import List, Dict, Any
from backend.app.models.schemas import (
    CaseDetailResponse,
    DocumentItem,
    LandRecord,
    TransactionRecord,
    ExtractedField,
    BoundingBox,
    CaseReviewRecord,
    TimelineEvent
)
from backend.app.services.fraud_engine import FraudDetectionEngine
from backend.app.services.ocr_service import OCRServiceAdapter


DEMO_DISCLAIMER_LABEL = "DEMO DATA — NOT AN OFFICIAL LAND RECORD"


def create_synthetic_cases() -> List[CaseDetailResponse]:
    """Generates 20 distinct synthetic cases covering all rules and scenarios."""
    cases: List[CaseDetailResponse] = []
    base_time = datetime(2026, 1, 15, 10, 0, 0)

    # =========================================================================
    # Case 1: Clean Legitimate Record (No conflict, Low Risk)
    # =========================================================================
    c1_id = "case-demo-001"
    c1_docs = [
        DocumentItem(
            id="doc-001-deed",
            case_id=c1_id,
            file_name="SAF_KABALA_DEED_10482_2021.pdf",
            file_type="pdf",
            file_size_bytes=1048576,
            file_hash_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            storage_path="/storage/demo/deed_10482.pdf",
            doc_category="deed",
            ocr_status="completed",
            raw_ocr_text="গণপ্রজাতন্ত্রী বাংলাদেশ সরকার। সাব-রেজিস্ট্রার কার্যালয় সাভার, ঢাকা। সাফ কোবালা দলিল নং ১০৪৮২/২০২১। মৌজা: বাউনিয়া, জেএল নং ৪২। খতিয়ান নং আরএস-৫২০, দাগ নং ১০২৫। জমির পরিমাণ: ১২ শতক। ক্রেতা: জনাব পারভেজ আলম (BUYER-ALIM-101)। বিক্রেতা: মো: রফিক উদ্দিন (SELLER-ROFIQ-101)।",
            confidence_score=0.96,
            uploaded_at=base_time,
            extracted_fields=[
                ExtractedField(field_name="deed_no", original_value="১০৪৮২/২০২১", normalized_value="10482/2021", confidence=0.98),
                ExtractedField(field_name="district", original_value="ঢাকা", normalized_value="Dhaka", confidence=0.98),
                ExtractedField(field_name="upazila", original_value="সাভার", normalized_value="Savar", confidence=0.98),
                ExtractedField(field_name="mouza", original_value="বাউনিয়া", normalized_value="Baunia", confidence=0.98),
                ExtractedField(field_name="dag_no", original_value="১০২৫", normalized_value="1025", confidence=0.98),
                ExtractedField(field_name="khatian_no", original_value="৫২০", normalized_value="520", confidence=0.97),
                ExtractedField(field_name="land_area", original_value="১২ শতক", normalized_value="12.0 decimal (5227.2 sq.ft)", confidence=0.97),
                ExtractedField(field_name="buyer_name", original_value="জনাব পারভেজ আলম", normalized_value="Parvez Alim (BUYER-ALIM-101)", confidence=0.96),
                ExtractedField(field_name="seller_name", original_value="মো: রফিক উদ্দিন", normalized_value="Md Rofiq Uddin (SELLER-ROFIQ-101)", confidence=0.96),
                ExtractedField(field_name="transaction_date", original_value="১২-০৪-২০২১", normalized_value="2021-04-12", confidence=0.96)
            ]
        ),
        DocumentItem(
            id="doc-001-mut",
            case_id=c1_id,
            file_name="MUTATION_KHATIAN_8842.pdf",
            file_type="pdf",
            file_size_bytes=524288,
            file_hash_sha256="cca99c1543666b694fc8ba92d47781b08493f0b2f6ab3ef821422731c3b12984",
            storage_path="/storage/demo/mutation_8842.pdf",
            doc_category="mutation_record",
            ocr_status="completed",
            raw_ocr_text="সহকারী কমিশনার (ভূমি) এর কার্যালয়, সাভার। নামজারি খতিয়ান নং ৮৮৪২। জোত নং ৯৯। সাবেক খতিয়ান আরএস-৫২০, সাবেক দাগ ১০২৫। বর্তমান নামজারি দাগ ১০২৫/১। জমির পরিমাণ: ১২ শতক। মালিক: জনাব পারভেজ আলম।",
            confidence_score=0.95,
            uploaded_at=base_time,
            extracted_fields=[
                ExtractedField(field_name="khatian_no", original_value="৮৮৪২", normalized_value="8842", confidence=0.96),
                ExtractedField(field_name="dag_no", original_value="১০২৫", normalized_value="1025", confidence=0.96),
                ExtractedField(field_name="district", original_value="ঢাকা", normalized_value="Dhaka", confidence=0.98),
                ExtractedField(field_name="upazila", original_value="সাভার", normalized_value="Savar", confidence=0.98),
                ExtractedField(field_name="mouza", original_value="বাউনিয়া", normalized_value="Baunia", confidence=0.98),
                ExtractedField(field_name="land_area", original_value="১২ শতক", normalized_value="12.0 decimal (5227.2 sq.ft)", confidence=0.96),
                ExtractedField(field_name="buyer_name", original_value="জনাব পারভেজ আলম", normalized_value="Parvez Alim (BUYER-ALIM-101)", confidence=0.95)
            ]
        )
    ]
    c1_records = [
        LandRecord(
            id="lr-001",
            case_id=c1_id,
            document_id="doc-001-deed",
            district="Dhaka",
            upazila="Savar",
            mouza="Baunia",
            khatian_type="RS",
            khatian_no="520",
            dag_no="1025",
            recorded_land_area_decimal=12.0,
            recorded_land_area_sqft=5227.2,
            deed_no="10482/2021",
            deed_date=date(2021, 4, 12)
        )
    ]
    c1_txns = [
        TransactionRecord(
            id="txn-001",
            case_id=c1_id,
            plot_identifier="DHAKA|SAVAR|BAUNIA|KH-520|DAG-1025",
            transaction_date=date(2021, 4, 12),
            registration_date=date(2021, 4, 15),
            mutation_date=date(2021, 8, 20),
            deed_no="10482/2021",
            buyer_name="Parvez Alim (BUYER-ALIM-101)",
            seller_name="Md Rofiq Uddin (SELLER-ROFIQ-101)",
            consideration_bdt=3600000.0
        )
    ]
    c1_timeline = [
        TimelineEvent(
            id="tl-001-1",
            event_date="2021-04-12",
            event_type="deed_executed",
            title="Saf Kabala Deed 10482 Executed",
            description="Deed executed by seller Md Rofiq Uddin to buyer Parvez Alim for 12 decimals.",
            record_type="Transaction"
        ),
        TimelineEvent(
            id="tl-001-2",
            event_date="2021-04-15",
            event_type="registration",
            title="Sub-Registry Registration Endorsed",
            description="Deed 10482/2021 registered under Savar Sub-Registry volume book.",
            record_type="Transaction"
        ),
        TimelineEvent(
            id="tl-001-3",
            event_date="2021-08-20",
            event_type="mutation_approved",
            title="AC Land Mutation Case 8842 Sanctioned",
            description="Mutation khatian 8842 issued without objection; dakhila updated.",
            record_type="Document"
        )
    ]

    c1_radar = FraudDetectionEngine.evaluate_case(c1_id, "BV-2026-0001", c1_docs, c1_records, c1_txns)
    cases.append(CaseDetailResponse(
        id=c1_id,
        tracking_id="BV-2026-0001",
        user_id="user-citizen-demo-01",
        title="Verification of Dag 1025, Baunia Mouza (Savar)",
        description="Clean title deed & e-Namjari verification application. (DEMO DATA — NOT AN OFFICIAL LAND RECORD)",
        district="Dhaka",
        upazila="Savar",
        mouza="Baunia",
        plot_khatian_summary="Dag 1025, RS Khatian 520, Mutation 8842",
        status="approved",
        risk_level=c1_radar.overall_risk_level,
        is_demo=True,
        submitted_at=base_time,
        updated_at=base_time + timedelta(hours=2),
        documents=c1_docs,
        land_records=c1_records,
        transactions=c1_txns,
        findings=c1_radar.findings,
        reviews=[
            CaseReviewRecord(
                id="rev-001",
                case_id=c1_id,
                reviewer_name="Admin Reviewer (Land Officer 01)",
                action="approve_workflow",
                decision_reason="All records match precisely; deed and mutation are in perfect harmony. No cross-case conflict found.",
                created_at=base_time + timedelta(hours=2)
            )
        ],
        timeline=c1_timeline,
        radar=c1_radar
    ))

    # =========================================================================
    # Case 2: Double-Selling Conflict (Rule B - HIGH RISK)
    # =========================================================================
    c2_id = "case-demo-002"
    c2_docs = [
        DocumentItem(
            id="doc-002-deed-a",
            case_id=c2_id,
            file_name="DEED_5510_2020_KABIR.pdf",
            file_type="pdf",
            file_size_bytes=1048576,
            file_hash_sha256="a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef",
            storage_path="/storage/demo/deed_5510.pdf",
            doc_category="deed",
            ocr_status="completed",
            raw_ocr_text="সাব-রেজিস্ট্রার কার্যালয় গুলশান, ঢাকা। কবলা দলিল নং ৫৫১০/২০২০। মৌজা: জোয়ার সাহারা। দাগ নং ৪০৫। খতিয়ান আরএস-২০২। জমির পরিমাণ: ৮ শতক। ক্রেতা: জনাব কবির আহমেদ (BUYER-KABIR)। বিক্রেতা: মোস্তাফিজুর রহমান (SELLER-MOSTAFIZ)।",
            confidence_score=0.94,
            uploaded_at=base_time + timedelta(days=1),
            extracted_fields=[
                ExtractedField(field_name="deed_no", original_value="৫৫১০/২০২০", normalized_value="5510/2020", confidence=0.96),
                ExtractedField(field_name="district", original_value="ঢাকা", normalized_value="Dhaka", confidence=0.98),
                ExtractedField(field_name="upazila", original_value="গুলশান", normalized_value="Gulshan", confidence=0.98),
                ExtractedField(field_name="mouza", original_value="জোয়ার সাহারা", normalized_value="Joar Sahara", confidence=0.97),
                ExtractedField(field_name="dag_no", original_value="৪০৫", normalized_value="405", confidence=0.98),
                ExtractedField(field_name="khatian_no", original_value="২০২", normalized_value="202", confidence=0.97),
                ExtractedField(field_name="land_area", original_value="৮ শতক", normalized_value="8.0 decimal (3484.8 sq.ft)", confidence=0.95),
                ExtractedField(field_name="buyer_name", original_value="জনাব কবির আহমেদ", normalized_value="Kabir Ahmed (BUYER-KABIR)", confidence=0.96),
                ExtractedField(field_name="seller_name", original_value="মোস্তাফিজুর রহমান", normalized_value="Mostafizur Rahman (SELLER-MOSTAFIZ)", confidence=0.95),
                ExtractedField(field_name="transaction_date", original_value="১৫-০২-২০২০", normalized_value="2020-02-15", confidence=0.95)
            ]
        ),
        DocumentItem(
            id="doc-002-deed-b",
            case_id=c2_id,
            file_name="DEED_9104_2023_TARIQ.pdf",
            file_type="pdf",
            file_size_bytes=1048576,
            file_hash_sha256="f9e8d7c6b5a4039281726354453627181920abcdef1234567890abcdef123456",
            storage_path="/storage/demo/deed_9104.pdf",
            doc_category="deed",
            ocr_status="completed",
            raw_ocr_text="সাব-রেজিস্ট্রার কার্যালয় গুলশান, ঢাকা। কবলা দলিল নং ৯১০৪/২০২৩। মৌজা: জোয়ার সাহারা। দাগ নং ৪০৫। খতিয়ান আরএস-২০২। জমির পরিমাণ: ৮ শতক। ক্রেতা: তারিকুল ইসলাম (BUYER-TARIQ)। বিক্রেতা: মোস্তাফিজুর রহমান (SELLER-MOSTAFIZ)।",
            confidence_score=0.93,
            uploaded_at=base_time + timedelta(days=1),
            extracted_fields=[
                ExtractedField(field_name="deed_no", original_value="৯১০৪/২০২৩", normalized_value="9104/2023", confidence=0.96),
                ExtractedField(field_name="district", original_value="ঢাকা", normalized_value="Dhaka", confidence=0.98),
                ExtractedField(field_name="upazila", original_value="গুলশান", normalized_value="Gulshan", confidence=0.98),
                ExtractedField(field_name="mouza", original_value="জোয়ার সাহারা", normalized_value="Joar Sahara", confidence=0.97),
                ExtractedField(field_name="dag_no", original_value="৪০৫", normalized_value="405", confidence=0.98),
                ExtractedField(field_name="khatian_no", original_value="২০২", normalized_value="202", confidence=0.97),
                ExtractedField(field_name="land_area", original_value="৮ শতক", normalized_value="8.0 decimal (3484.8 sq.ft)", confidence=0.95),
                ExtractedField(field_name="buyer_name", original_value="তারিকুল ইসলাম", normalized_value="Tariqul Islam (BUYER-TARIQ)", confidence=0.95),
                ExtractedField(field_name="seller_name", original_value="মোস্তাফিজুর রহমান", normalized_value="Mostafizur Rahman (SELLER-MOSTAFIZ)", confidence=0.95),
                ExtractedField(field_name="transaction_date", original_value="১০-০৫-২০২৩", normalized_value="2023-05-10", confidence=0.95)
            ]
        )
    ]
    c2_records = [
        LandRecord(
            id="lr-002",
            case_id=c2_id,
            document_id="doc-002-deed-a",
            district="Dhaka",
            upazila="Gulshan",
            mouza="Joar Sahara",
            khatian_type="RS",
            khatian_no="202",
            dag_no="405",
            recorded_land_area_decimal=8.0,
            recorded_land_area_sqft=3484.8,
            deed_no="5510/2020",
            deed_date=date(2020, 2, 15)
        )
    ]
    c2_txns = [
        TransactionRecord(
            id="txn-002-a",
            case_id=c2_id,
            plot_identifier="DHAKA|GULSHAN|JOAR SAHARA|KH-202|DAG-405",
            transaction_date=date(2020, 2, 15),
            registration_date=date(2020, 2, 18),
            deed_no="5510/2020",
            buyer_name="Kabir Ahmed (BUYER-KABIR)",
            seller_name="Mostafizur Rahman (SELLER-MOSTAFIZ)",
            consideration_bdt=4800000.0
        ),
        TransactionRecord(
            id="txn-002-b",
            case_id=c2_id,
            plot_identifier="DHAKA|GULSHAN|JOAR SAHARA|KH-202|DAG-405",
            transaction_date=date(2023, 5, 10),
            registration_date=date(2023, 5, 12),
            deed_no="9104/2023",
            buyer_name="Tariqul Islam (BUYER-TARIQ)",
            seller_name="Mostafizur Rahman (SELLER-MOSTAFIZ)",
            consideration_bdt=6200000.0
        )
    ]
    c2_timeline = [
        TimelineEvent(
            id="tl-002-1",
            event_date="2020-02-15",
            event_type="deed_executed",
            title="Deed 5510/2020 Executed",
            description="Seller Mostafizur Rahman sold Dag 405 (8 decimals) to Kabir Ahmed.",
            record_type="Transaction"
        ),
        TimelineEvent(
            id="tl-002-2",
            event_date="2023-05-10",
            event_type="deed_executed",
            title="Deed 9104/2023 Executed (CONFLICT)",
            description="Same Seller Mostafizur Rahman purported to sell the SAME Dag 405 to Tariqul Islam without revoking previous deed.",
            is_conflict=True,
            record_type="Transaction"
        ),
        TimelineEvent(
            id="tl-002-3",
            event_date="2026-01-16",
            event_type="conflict_alert",
            title="Double-Selling Conflict Flagged",
            description="BHUMIVerse Rule B flagged high-severity double-conveyance risk.",
            is_conflict=True,
            record_type="Finding"
        )
    ]

    c2_radar = FraudDetectionEngine.evaluate_case(c2_id, "BV-2026-0002", c2_docs, c2_records, c2_txns)
    cases.append(CaseDetailResponse(
        id=c2_id,
        tracking_id="BV-2026-0002",
        user_id="user-citizen-demo-02",
        title="Double-Selling Alert: Dag 405, Joar Sahara Mouza (Gulshan)",
        description="High-risk conflict: Same seller executed two distinct sale deeds for Dag 405 to two unrelated buyers. (DEMO DATA)",
        district="Dhaka",
        upazila="Gulshan",
        mouza="Joar Sahara",
        plot_khatian_summary="Dag 405, RS Khatian 202 (8.0 decimals)",
        status="under_review",
        risk_level=c2_radar.overall_risk_level,
        is_demo=True,
        submitted_at=base_time + timedelta(days=1),
        updated_at=base_time + timedelta(days=1, hours=3),
        documents=c2_docs,
        land_records=c2_records,
        transactions=c2_txns,
        findings=c2_radar.findings,
        reviews=[
            CaseReviewRecord(
                id="rev-002",
                case_id=c2_id,
                reviewer_name="Senior Land Inspector",
                action="escalate",
                decision_reason="Severe risk indicator: Deed 5510 (2020) and Deed 9104 (2023) both claim full 8 decimals on Dag 405. Escalate to District Sub-Registry for Balam verification.",
                created_at=base_time + timedelta(days=1, hours=3)
            )
        ],
        timeline=c2_timeline,
        radar=c2_radar
    ))

    # =========================================================================
    # Case 3: Registration-Mutation Mismatch (Rule C)
    # =========================================================================
    c3_id = "case-demo-003"
    c3_docs = [
        DocumentItem(
            id="doc-003-deed",
            case_id=c3_id,
            file_name="REGISTERED_DEED_4120_2022.pdf",
            file_type="pdf",
            file_size_bytes=819200,
            file_hash_sha256="b8c7d6e5f4a30291827364554637281920abcdef1234567890abcdef12345678",
            storage_path="/storage/demo/deed_4120.pdf",
            doc_category="deed",
            ocr_status="completed",
            raw_ocr_text="সাব-রেজিস্ট্রি তেজগাঁও। সাফ কোবালা দলিল ৪১২০/২০২২। মৌজা: তেজগাঁও শিল্প এলাকা। দাগ নং ৭৫০। খতিয়ান বিএস-১১০। জমির পরিমাণ: ১৫ শতক। ক্রেতা: ফারহানা হক (BUYER-FARHANA)।",
            confidence_score=0.92,
            uploaded_at=base_time + timedelta(days=2),
            extracted_fields=[
                ExtractedField(field_name="deed_no", original_value="৪১২০/২০২২", normalized_value="4120/2022", confidence=0.95),
                ExtractedField(field_name="district", original_value="ঢাকা", normalized_value="Dhaka", confidence=0.98),
                ExtractedField(field_name="upazila", original_value="তেজগাঁও", normalized_value="Tejgaon", confidence=0.98),
                ExtractedField(field_name="mouza", original_value="তেজগাঁও শিল্প এলাকা", normalized_value="Tejgaon Industrial", confidence=0.96),
                ExtractedField(field_name="dag_no", original_value="৭৫০", normalized_value="750", confidence=0.95),
                ExtractedField(field_name="khatian_no", original_value="১১০", normalized_value="110", confidence=0.94),
                ExtractedField(field_name="land_area", original_value="১৫ শতক", normalized_value="15.0 decimal (6534.0 sq.ft)", confidence=0.93),
                ExtractedField(field_name="buyer_name", original_value="ফারহানা হক", normalized_value="Farhana Haque (BUYER-FARHANA)", confidence=0.94)
            ]
        ),
        DocumentItem(
            id="doc-003-mut",
            case_id=c3_id,
            file_name="MUTATION_PROPOSAL_DAKHILA.pdf",
            file_type="pdf",
            file_size_bytes=614400,
            file_hash_sha256="c7d8e9f0a1b2039485761234567890abcdef1234567890abcdef1234567890ab",
            storage_path="/storage/demo/mutation_mismatch.pdf",
            doc_category="mutation_record",
            ocr_status="completed",
            raw_ocr_text="সহকারী কমিশনার (ভূমি) তেজগাঁও সার্কেল। নামজারি খতিয়ান প্রস্তাব। সাবেক দাগ: ৮২০। খতিয়ান: ১১০। মৌজা: তেজগাঁও। প্রস্তাবিত নামজারি জমির পরিমাণ: ৮ শতক।",
            confidence_score=0.91,
            uploaded_at=base_time + timedelta(days=2),
            extracted_fields=[
                ExtractedField(field_name="dag_no", original_value="৮২০", normalized_value="820", confidence=0.94),
                ExtractedField(field_name="district", original_value="ঢাকা", normalized_value="Dhaka", confidence=0.98),
                ExtractedField(field_name="upazila", original_value="তেজগাঁও", normalized_value="Tejgaon", confidence=0.98),
                ExtractedField(field_name="mouza", original_value="তেজগাঁও", normalized_value="Tejgaon Industrial", confidence=0.96),
                ExtractedField(field_name="khatian_no", original_value="১১০", normalized_value="110", confidence=0.93),
                ExtractedField(field_name="land_area", original_value="৮ শতক", normalized_value="8.0 decimal (3484.8 sq.ft)", confidence=0.92)
            ]
        )
    ]
    c3_records = [
        LandRecord(
            id="lr-003",
            case_id=c3_id,
            document_id="doc-003-deed",
            district="Dhaka",
            upazila="Tejgaon",
            mouza="Tejgaon Industrial",
            khatian_type="BS",
            khatian_no="110",
            dag_no="750",
            recorded_land_area_decimal=15.0,
            recorded_land_area_sqft=6534.0,
            deed_no="4120/2022"
        )
    ]
    c3_txns = []
    c3_radar = FraudDetectionEngine.evaluate_case(c3_id, "BV-2026-0003", c3_docs, c3_records, c3_txns)
    cases.append(CaseDetailResponse(
        id=c3_id,
        tracking_id="BV-2026-0003",
        user_id="user-citizen-demo-03",
        title="Reg-Mutation Plot & Area Mismatch: Tejgaon",
        description="Registered Deed cites Dag 750 (15 decimals) but submitted Mutation record shows Dag 820 (8 decimals). (DEMO DATA)",
        district="Dhaka",
        upazila="Tejgaon",
        mouza="Tejgaon Industrial",
        plot_khatian_summary="Deed Dag 750 vs Mutation Dag 820",
        status="info_requested",
        risk_level=c3_radar.overall_risk_level,
        is_demo=True,
        submitted_at=base_time + timedelta(days=2),
        updated_at=base_time + timedelta(days=2, hours=1),
        documents=c3_docs,
        land_records=c3_records,
        transactions=c3_txns,
        findings=c3_radar.findings,
        reviews=[
            CaseReviewRecord(
                id="rev-003",
                case_id=c3_id,
                reviewer_name="Compliance Officer",
                action="request_more_info",
                decision_reason="Discrepancy detected: Dag 750 on deed vs Dag 820 on mutation. Please upload AC Land namjari approval order sheet explaining plot renumbering.",
                created_at=base_time + timedelta(days=2, hours=1)
            )
        ],
        timeline=[
            TimelineEvent(
                id="tl-003-1",
                event_date="2022-06-18",
                event_type="deed_executed",
                title="Deed 4120 Executed on Dag 750",
                description="Deed executed specifying Dag 750 for 15 decimals.",
                record_type="Document"
            ),
            TimelineEvent(
                id="tl-003-2",
                event_date="2026-01-17",
                event_type="conflict_alert",
                title="Plot Identifier Discrepancy Flagged",
                description="Deed mentions Dag 750 while mutation cites Dag 820.",
                is_conflict=True,
                record_type="Finding"
            )
        ],
        radar=c3_radar
    ))

    # =========================================================================
    # Case 4: Duplicate File Hash Upload (Rule A)
    # =========================================================================
    c4_id = "case-demo-004"
    c4_docs = [
        DocumentItem(
            id="doc-004-a",
            case_id=c4_id,
            file_name="ORIGINAL_DEED_SCAN_SAVAR.pdf",
            file_type="pdf",
            file_size_bytes=1048576,
            file_hash_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",  # Matches doc-001
            storage_path="/storage/demo/deed_10482_copy.pdf",
            doc_category="deed",
            ocr_status="completed",
            raw_ocr_text="সাভার, ঢাকা। সাফ কোবালা দলিল নং ১০৪৮২/২০২১। মৌজা বাউনিয়া, দাগ ১০২৫।",
            confidence_score=0.96,
            uploaded_at=base_time + timedelta(days=3),
            extracted_fields=[
                ExtractedField(field_name="deed_no", original_value="১০৪৮২/২০২১", normalized_value="10482/2021", confidence=0.98),
                ExtractedField(field_name="dag_no", original_value="১০২৫", normalized_value="1025", confidence=0.98),
                ExtractedField(field_name="mouza", original_value="বাউনিয়া", normalized_value="Baunia", confidence=0.98),
                ExtractedField(field_name="district", original_value="ঢাকা", normalized_value="Dhaka", confidence=0.98),
                ExtractedField(field_name="upazila", original_value="সাভার", normalized_value="Savar", confidence=0.98)
            ]
        )
    ]
    c4_radar = FraudDetectionEngine.evaluate_case(
        c4_id, "BV-2026-0004", c4_docs, [], [],
        all_system_documents=c1_docs
    )
    cases.append(CaseDetailResponse(
        id=c4_id,
        tracking_id="BV-2026-0004",
        user_id="user-citizen-demo-04",
        title="Cross-Case Duplicate File Submission Alert",
        description="Document submitted in this case has identical SHA-256 hash to a previously processed Case BV-2026-0001. (DEMO DATA)",
        district="Dhaka",
        upazila="Savar",
        mouza="Baunia",
        plot_khatian_summary="Dag 1025, Hash Collision",
        status="under_review",
        risk_level=c4_radar.overall_risk_level,
        is_demo=True,
        submitted_at=base_time + timedelta(days=3),
        updated_at=base_time + timedelta(days=3),
        documents=c4_docs,
        land_records=[],
        transactions=[],
        findings=c4_radar.findings,
        reviews=[],
        timeline=[],
        radar=c4_radar
    ))

    # =========================================================================
    # Cases 5 to 20: Additional Diverse Scenarios
    # (Area discrepancy, missing fields, OCR low confidence, altered copy,
    #  similar names protection, timeline inversion, legitimate co-ownership, etc.)
    # =========================================================================
    scenario_configs = [
        # 5: Area Discrepancy (Rule D)
        {
            "id": "case-demo-005", "tracking": "BV-2026-0005",
            "title": "Land Area Discrepancy: Dag 88, Badda",
            "desc": "Deed specifies 20.0 decimals while mutation dakhila specifies 12.5 decimals (variance > 37%).",
            "dist": "Dhaka", "upaz": "Badda", "mouza": "Satarkul", "dag": "88", "khatian": "304",
            "docs": [
                {"name": "DEED_88_BADDA.pdf", "cat": "deed", "area": "20 শতক", "area_norm": "20.0 decimal", "dag": "88", "hash": "h05a"},
                {"name": "MUTATION_88_BADDA.pdf", "cat": "mutation_record", "area": "12.5 শতক", "area_norm": "12.5 decimal", "dag": "88", "hash": "h05b"}
            ]
        },
        # 6: Missing Critical Fields (Rule E - Incomplete Information)
        {
            "id": "case-demo-006", "tracking": "BV-2026-0006",
            "title": "Incomplete Document Metadata: Savar Plot",
            "desc": "Old handwritten porcha missing Dag number and Mouza identifier. Classified as incomplete information, not fraud.",
            "dist": "Dhaka", "upaz": "Savar", "mouza": "", "dag": "", "khatian": "12",
            "docs": [
                {"name": "BLURRED_PORCHA_SCAN.pdf", "cat": "khatian_porcha", "area": "10 শতক", "area_norm": "10.0 decimal", "dag": "", "hash": "h06a"}
            ]
        },
        # 7: Low-Confidence OCR Scan (Rule F)
        {
            "id": "case-demo-007", "tracking": "BV-2026-0007",
            "title": "Degraded Scan OCR Uncertainty: Mirpur",
            "desc": "Faded ink and fold lines on deed produced OCR confidence scores below 0.60. Flagged for manual reading.",
            "dist": "Dhaka", "upaz": "Mirpur", "mouza": "Senpara Parbata", "dag": "314", "khatian": "90",
            "low_ocr": True,
            "docs": [
                {"name": "FADED_DEED_SCAN_1998.jpg", "cat": "deed", "area": "5 শতক", "area_norm": "5.0 decimal", "dag": "314", "hash": "h07a"}
            ]
        },
        # 8: Altered Document Photocopy (Rule G)
        {
            "id": "case-demo-008", "tracking": "BV-2026-0008",
            "title": "Conflicting Party Names on Same Deed No 604",
            "desc": "Two submitted photocopies claim to be Deed 604/2019 but have different buyer names inserted.",
            "dist": "Gazipur", "upaz": "Sreepur", "mouza": "Baraipara", "dag": "512", "khatian": "411",
            "docs": [
                {"name": "DEED_604_COPY_ALAM.pdf", "cat": "deed", "deed_no": "604/2019", "buyer": "Md Alamgir (BUYER-ALAMGIR)", "dag": "512", "hash": "h08a"},
                {"name": "DEED_604_COPY_JAHID.pdf", "cat": "deed", "deed_no": "604/2019", "buyer": "Jahidul Hasan (BUYER-JAHID)", "dag": "512", "hash": "h08b"}
            ]
        },
        # 9: Timeline Inconsistency / Inverted Sequence (Rule H)
        {
            "id": "case-demo-009", "tracking": "BV-2026-0009",
            "title": "Timeline Anomaly: Registration Prior to Deed Execution",
            "desc": "Sub-Registrar endorsement date is indexed earlier than the purported execution date of deed.",
            "dist": "Dhaka", "upaz": "Dhanmondi", "mouza": "Dhanmondi R/A", "dag": "12", "khatian": "5",
            "timeline_invert": True,
            "docs": [
                {"name": "DEED_DHANMONDI_INVERTED.pdf", "cat": "deed", "dag": "12", "hash": "h09a"}
            ]
        },
        # 10: Legitimate Co-Ownership / Sub-plot (Positive Clean Case)
        {
            "id": "case-demo-010", "tracking": "BV-2026-0010",
            "title": "Clean Co-Ownership Transfer: Keraniganj",
            "desc": "Father transferred undivided 5 decimals out of 20 decimals to daughter via legitimate Heba deed.",
            "dist": "Dhaka", "upaz": "Keraniganj", "mouza": "Zinjira", "dag": "210", "khatian": "88",
            "docs": [
                {"name": "HEBA_DEED_PARTITION.pdf", "cat": "deed", "area": "5 শতক", "area_norm": "5.0 decimal", "dag": "210", "hash": "h10a"}
            ]
        },
        # 11: Similar Names Protection (Anti False-Positive)
        {
            "id": "case-demo-011", "tracking": "BV-2026-0011",
            "title": "Distinct Identity Verification: Md Rafiq vs Rafiqul Islam Khan",
            "desc": "Validates that similar name tokens are not erroneously merged into the same persona.",
            "dist": "Dhaka", "upaz": "Uttara", "mouza": "Faydabad", "dag": "94", "khatian": "114",
            "docs": [
                {"name": "DEED_RAFIQ_1.pdf", "cat": "deed", "buyer": "Md Rafiq", "dag": "94", "hash": "h11a"}
            ]
        },
        # 12 to 20: Additional realistic cases
        {"id": "case-demo-012", "tracking": "BV-2026-0012", "title": "Routine Porcha Verification: Savar Dag 55", "desc": "RS Porcha record matches land revenue database. (DEMO DATA)", "dist": "Dhaka", "upaz": "Savar", "mouza": "Ashulia", "dag": "55", "khatian": "22", "docs": [{"name": "ASHULIA_PORCHA.pdf", "cat": "khatian_porcha", "dag": "55", "hash": "h12a"}]},
        {"id": "case-demo-013", "tracking": "BV-2026-0013", "title": "Missing Mutation Reference: Kaliakair", "desc": "Deed registered in 2024 but mutation not yet completed. Status marked Insufficient Data.", "dist": "Gazipur", "upaz": "Kaliakair", "mouza": "Mouchak", "dag": "190", "khatian": "81", "docs": [{"name": "DEED_ONLY_NO_MUTATION.pdf", "cat": "deed", "dag": "190", "hash": "h13a"}]},
        {"id": "case-demo-014", "tracking": "BV-2026-0014", "title": "Double-Conveyance Risk: Tongi Dag 60", "desc": "Conflicting sale contracts recorded on same parcel in 2022 and 2025.", "dist": "Gazipur", "upaz": "Tongi", "mouza": "Tongi BSCIC", "dag": "60", "khatian": "45", "double_sale": True, "docs": [{"name": "TONGI_DEED_1.pdf", "cat": "deed", "dag": "60", "hash": "h14a"}]},
        {"id": "case-demo-015", "tracking": "BV-2026-0015", "title": "Standard Commercial Lease Verification", "desc": "Clean 99-year government commercial lease deed. (DEMO DATA)", "dist": "Dhaka", "upaz": "Tejgaon", "mouza": "Tejgaon", "dag": "100", "khatian": "1", "docs": [{"name": "LEASE_DEED.pdf", "cat": "deed", "dag": "100", "hash": "h15a"}]},
        {"id": "case-demo-016", "tracking": "BV-2026-0016", "title": "Land Area Unit Conversion Check (Katha to Decimal)", "desc": "Tests multi-unit normalization: 6 Katha converted precisely to 9.9 Decimals.", "dist": "Dhaka", "upaz": "Mirpur", "mouza": "Rupnagar", "dag": "402", "khatian": "16", "docs": [{"name": "KATHA_DEED.pdf", "cat": "deed", "area": "৬ কাঠা", "area_norm": "9.9 decimal", "dag": "402", "hash": "h16a"}]},
        {"id": "case-demo-017", "tracking": "BV-2026-0017", "title": "Inheritance Successor Warishan Title Review", "desc": "Clear succession chain with registered warishan distribution deed.", "dist": "Dhaka", "upaz": "Dhamrai", "mouza": "Kushura", "dag": "810", "khatian": "330", "docs": [{"name": "WARISHAN_DEED.pdf", "cat": "deed", "dag": "810", "hash": "h17a"}]},
        {"id": "case-demo-018", "tracking": "BV-2026-0018", "title": "Agricultural Land Development Tax Verification", "desc": "Clean LD-Tax (খাজনা দাখিলা) clearance for fiscal year 2025-26.", "dist": "Dhaka", "upaz": "Savar", "mouza": "Vakurta", "dag": "119", "khatian": "75", "docs": [{"name": "LD_TAX_DAKHILA.pdf", "cat": "tax_receipt", "dag": "119", "hash": "h18a"}]},
        {"id": "case-demo-019", "tracking": "BV-2026-0019", "title": "Subdivision Dag Suffix Verification (Dag 205/1)", "desc": "Subdivision recorded under AC Land survey order sheet.", "dist": "Narayanganj", "upaz": "Rupganj", "mouza": "Murapara", "dag": "205/1", "khatian": "120", "docs": [{"name": "SUBDIVISION_DEED.pdf", "cat": "deed", "dag": "205/1", "hash": "h19a"}]},
        {"id": "case-demo-020", "tracking": "BV-2026-0020", "title": "Clean Khatian Porcha Title Screen: Gulshan", "desc": "City Survey (BS) Khatian verified against land records repository.", "dist": "Dhaka", "upaz": "Gulshan", "mouza": "Baridhara", "dag": "10", "khatian": "4", "docs": [{"name": "CITY_SURVEY_BS_PORCHA.pdf", "cat": "khatian_porcha", "dag": "10", "hash": "h20a"}]}
    ]

    for sc in scenario_configs:
        cid = sc["id"]
        docs: List[DocumentItem] = []
        for d in sc["docs"]:
            low_conf = sc.get("low_ocr", False)
            fields = [
                ExtractedField(field_name="district", original_value=sc["dist"], normalized_value=sc["dist"], confidence=0.55 if low_conf else 0.95),
                ExtractedField(field_name="upazila", original_value=sc["upaz"], normalized_value=sc["upaz"], confidence=0.55 if low_conf else 0.95),
                ExtractedField(field_name="mouza", original_value=sc["mouza"], normalized_value=sc["mouza"], confidence=0.50 if low_conf else 0.95),
                ExtractedField(field_name="dag_no", original_value=d.get("dag", sc["dag"]), normalized_value=d.get("dag", sc["dag"]), confidence=0.45 if low_conf else 0.95),
                ExtractedField(field_name="khatian_no", original_value=sc["khatian"], normalized_value=sc["khatian"], confidence=0.50 if low_conf else 0.95),
            ]
            if "area" in d:
                fields.append(ExtractedField(field_name="land_area", original_value=d["area"], normalized_value=d["area_norm"], confidence=0.50 if low_conf else 0.92))
            if "buyer" in d:
                fields.append(ExtractedField(field_name="buyer_name", original_value=d["buyer"], normalized_value=d["buyer"], confidence=0.50 if low_conf else 0.94))
            if "deed_no" in d:
                fields.append(ExtractedField(field_name="deed_no", original_value=d["deed_no"], normalized_value=d["deed_no"], confidence=0.50 if low_conf else 0.95))

            docs.append(DocumentItem(
                id=f"doc-{cid}-{len(docs)+1}",
                case_id=cid,
                file_name=d["name"],
                file_type="pdf",
                file_size_bytes=512000,
                file_hash_sha256=d["hash"] * 8 if len(d["hash"]) < 64 else d["hash"],
                storage_path=f"/storage/demo/{d['name']}",
                doc_category=d["cat"],
                ocr_status="completed",
                raw_ocr_text=f"Synthetic land document for {sc['title']}",
                confidence_score=0.52 if low_conf else 0.94,
                uploaded_at=base_time + timedelta(days=int(sc["id"].split("-")[-1])),
                extracted_fields=fields
            ))

        records = [
            LandRecord(
                id=f"lr-{cid}",
                case_id=cid,
                district=sc["dist"],
                upazila=sc["upaz"],
                mouza=sc["mouza"] or "Unknown",
                khatian_type="RS",
                khatian_no=sc["khatian"] or "Unknown",
                dag_no=sc["dag"] or "Unknown",
                recorded_land_area_decimal=10.0
            )
        ]

        txns: List[TransactionRecord] = []
        if sc.get("timeline_invert"):
            txns = [
                TransactionRecord(
                    id=f"txn-{cid}-1",
                    case_id=cid,
                    plot_identifier=f"{sc['dist'].upper()}|{sc['upaz'].upper()}|{sc['mouza'].upper()}|DAG-{sc['dag']}",
                    transaction_date=date(2023, 10, 15),
                    registration_date=date(2023, 8, 10),  # Anomaly: Registration before execution!
                    deed_no="902/2023",
                    buyer_name="Zubair Hossain",
                    seller_name="Kamal Pasha"
                )
            ]
        elif sc.get("double_sale"):
            txns = [
                TransactionRecord(
                    id=f"txn-{cid}-1",
                    case_id=cid,
                    plot_identifier=f"{sc['dist'].upper()}|{sc['upaz'].upper()}|{sc['mouza'].upper()}|DAG-{sc['dag']}",
                    transaction_date=date(2022, 3, 12),
                    deed_no="1201/2022",
                    buyer_name="Salim Khan",
                    seller_name="Abdul Mazid"
                ),
                TransactionRecord(
                    id=f"txn-{cid}-2",
                    case_id=cid,
                    plot_identifier=f"{sc['dist'].upper()}|{sc['upaz'].upper()}|{sc['mouza'].upper()}|DAG-{sc['dag']}",
                    transaction_date=date(2025, 1, 20),
                    deed_no="4050/2025",
                    buyer_name="Nurul Haque",
                    seller_name="Abdul Mazid"
                )
            ]

        radar = FraudDetectionEngine.evaluate_case(cid, sc["tracking"], docs, records, txns)
        cases.append(CaseDetailResponse(
            id=cid,
            tracking_id=sc["tracking"],
            user_id="user-citizen-demo-general",
            title=sc["title"],
            description=f"{sc['desc']} ({DEMO_DISCLAIMER_LABEL})",
            district=sc["dist"],
            upazila=sc["upaz"],
            mouza=sc["mouza"],
            plot_khatian_summary=f"Dag {sc['dag']}, Khatian {sc['khatian']}",
            status="under_review" if radar.findings else "approved",
            risk_level=radar.overall_risk_level,
            is_demo=True,
            submitted_at=base_time + timedelta(days=int(sc["id"].split("-")[-1])),
            updated_at=base_time + timedelta(days=int(sc["id"].split("-")[-1]), hours=1),
            documents=docs,
            land_records=records,
            transactions=txns,
            findings=radar.findings,
            reviews=[],
            timeline=[
                TimelineEvent(
                    id=f"tl-{cid}-1",
                    event_date=str(base_time.date()),
                    event_type="deed_executed",
                    title="Document Submitted",
                    description=sc["desc"],
                    record_type="Document"
                )
            ],
            radar=radar
        ))

    return cases
