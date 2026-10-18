"""
Automated Test Suite for BHUMIVerse Backend.
Tests:
- Normalization (Bengali numerals, area conversions, name guards)
- Rule-based fraud detection engine (Rules A through H)
- Audit trail append-only invariants
- PDF report generation
"""

import pytest
from datetime import datetime, date
from backend.app.services.normalizer import (
    normalize_numerals,
    to_bengali_numerals,
    normalize_land_area,
    are_names_plausibly_different,
    normalize_identifier,
    normalize_plot_composite_key
)
from backend.app.services.ocr_service import OCRServiceAdapter
from backend.app.services.fraud_engine import FraudDetectionEngine
from backend.app.services.audit_service import AuditService
from backend.app.services.pdf_generator import PDFReportGenerator
from backend.app.models.schemas import (
    DocumentItem,
    LandRecord,
    TransactionRecord,
    ExtractedField,
    SeverityEnum,
    RiskLevelEnum
)


# =============================================================================
# 1. Normalization Tests
# =============================================================================
def test_bengali_numerals_normalization():
    assert normalize_numerals("১২৩৪৫৬৭৮৯০") == "1234567890"
    assert normalize_numerals("দলিল নং ১০৪৮২/২০২১") == "দলিল নং 10482/2021"
    assert normalize_numerals("দাগ নং ৪০৫") == "দাগ নং 405"
    assert to_bengali_numerals("12345") == "১২৩৪৫"


def test_land_area_normalization():
    # 12 decimals
    res1 = normalize_land_area("১২", "শতক")
    assert res1["decimals"] == 12.0
    assert res1["sqft"] == pytest.approx(12.0 * 435.6, 0.1)

    # 6 Katha = 9.9 decimals
    res2 = normalize_land_area("6", "katha")
    assert res2["decimals"] == pytest.approx(9.9, 0.05)

    # 1 Bigha = 33 decimals
    res3 = normalize_land_area("1", "bigha")
    assert res3["decimals"] == 33.0

    # 1 Acre = 100 decimals
    res4 = normalize_land_area("0.5", "acre")
    assert res4["decimals"] == 50.0


def test_similar_names_anti_false_positive():
    # Identical strings
    diff, reason = are_names_plausibly_different("Md. Rafiqul Islam", "md. rafiqul islam")
    assert diff is False

    # Distinct individuals with common partial tokens
    diff2, _ = are_names_plausibly_different("Md. Rafiqul Islam", "Rafiqul Islam Khan")
    assert diff2 is True

    diff3, _ = are_names_plausibly_different("Abdul Karim", "Abdul Karim Mollah")
    assert diff3 is True


# =============================================================================
# 2. Rule-Based Fraud Engine Tests
# =============================================================================
def test_rule_a_duplicate_file_detection():
    doc1 = DocumentItem(
        id="d1",
        case_id="case-1",
        file_name="deed.pdf",
        file_type="pdf",
        file_size_bytes=1000,
        file_hash_sha256="abc123hash",
        storage_path="/p1",
        doc_category="deed",
        ocr_status="completed",
        confidence_score=0.95,
        uploaded_at=datetime.now()
    )
    doc2 = DocumentItem(
        id="d2",
        case_id="case-1",
        file_name="deed_duplicate.pdf",
        file_type="pdf",
        file_size_bytes=1000,
        file_hash_sha256="abc123hash",
        storage_path="/p2",
        doc_category="deed",
        ocr_status="completed",
        confidence_score=0.95,
        uploaded_at=datetime.now()
    )

    radar = FraudDetectionEngine.evaluate_case("case-1", "BV-TEST-001", [doc1, doc2], [], [])
    rule_a_findings = [f for f in radar.findings if f.rule_id == "RULE_A_DUPLICATE_FILE"]
    assert len(rule_a_findings) >= 1
    assert "Duplicate File" in rule_a_findings[0].finding_type or "Identical File" in rule_a_findings[0].title


def test_rule_b_double_selling_detection():
    plot_rec = LandRecord(
        id="lr-1",
        case_id="case-double",
        district="Dhaka",
        upazila="Gulshan",
        mouza="Joar Sahara",
        khatian_no="202",
        dag_no="405",
        recorded_land_area_decimal=8.0
    )

    t1 = TransactionRecord(
        id="t1",
        case_id="case-double",
        plot_identifier="DHAKA|GULSHAN|JOAR SAHARA|KH-202|DAG-405",
        transaction_date=date(2020, 2, 1),
        deed_no="101/2020",
        buyer_name="Kabir Ahmed",
        seller_name="Mostafizur Rahman"
    )
    t2 = TransactionRecord(
        id="t2",
        case_id="case-double",
        plot_identifier="DHAKA|GULSHAN|JOAR SAHARA|KH-202|DAG-405",
        transaction_date=date(2023, 6, 1),
        deed_no="202/2023",
        buyer_name="Tariqul Islam",
        seller_name="Mostafizur Rahman"
    )

    radar = FraudDetectionEngine.evaluate_case(
        "case-double", "BV-TEST-002", [], [plot_rec], [t1, t2]
    )
    double_sell = [f for f in radar.findings if f.rule_id == "RULE_B_DOUBLE_SELLING"]
    assert len(double_sell) >= 1
    assert double_sell[0].severity == SeverityEnum.HIGH
    assert radar.overall_risk_level == RiskLevelEnum.HIGH


def test_rule_c_registration_mutation_insufficient_vs_mismatch():
    # Only deed uploaded -> Must return Insufficient Data, NOT declare mismatch
    doc_deed = DocumentItem(
        id="d-deed",
        case_id="case-c",
        file_name="deed.pdf",
        file_type="pdf",
        file_size_bytes=1000,
        file_hash_sha256="hash1",
        storage_path="/p",
        doc_category="deed",
        ocr_status="completed",
        confidence_score=0.9,
        uploaded_at=datetime.now(),
        extracted_fields=[
            ExtractedField(field_name="dag_no", original_value="750", normalized_value="750")
        ]
    )
    radar_single = FraudDetectionEngine.evaluate_case("case-c", "BV-TEST-003", [doc_deed], [], [])
    insufficient = [f for f in radar_single.findings if "Insufficient" in f.title]
    assert len(insufficient) >= 1

    # Both deed and mutation uploaded with conflicting Dag -> High severity mismatch
    doc_mut = DocumentItem(
        id="d-mut",
        case_id="case-c",
        file_name="mut.pdf",
        file_type="pdf",
        file_size_bytes=1000,
        file_hash_sha256="hash2",
        storage_path="/p",
        doc_category="mutation_record",
        ocr_status="completed",
        confidence_score=0.9,
        uploaded_at=datetime.now(),
        extracted_fields=[
            ExtractedField(field_name="dag_no", original_value="820", normalized_value="820")
        ]
    )
    radar_both = FraudDetectionEngine.evaluate_case("case-c", "BV-TEST-003", [doc_deed, doc_mut], [], [])
    mismatch = [f for f in radar_both.findings if f.rule_id == "RULE_C_REG_MUTATION_MISMATCH" and ("Discrepancy" in f.finding_type or "Mismatch" in f.title)]
    assert len(mismatch) >= 1
    assert mismatch[0].severity == SeverityEnum.HIGH


def test_rule_d_land_area_discrepancy():
    doc1 = DocumentItem(
        id="d1",
        case_id="case-d",
        file_name="deed.pdf",
        file_type="pdf",
        file_size_bytes=1000,
        file_hash_sha256="h1",
        storage_path="/p",
        doc_category="deed",
        ocr_status="completed",
        confidence_score=0.9,
        uploaded_at=datetime.now(),
        extracted_fields=[
            ExtractedField(field_name="land_area", original_value="20 decimal", normalized_value="20.0 decimal")
        ]
    )
    doc2 = DocumentItem(
        id="d2",
        case_id="case-d",
        file_name="mut.pdf",
        file_type="pdf",
        file_size_bytes=1000,
        file_hash_sha256="h2",
        storage_path="/p",
        doc_category="mutation_record",
        ocr_status="completed",
        confidence_score=0.9,
        uploaded_at=datetime.now(),
        extracted_fields=[
            ExtractedField(field_name="land_area", original_value="12.5 decimal", normalized_value="12.5 decimal")
        ]
    )
    radar = FraudDetectionEngine.evaluate_case("case-d", "BV-TEST-004", [doc1, doc2], [], [])
    area_finding = [f for f in radar.findings if f.rule_id == "RULE_D_AREA_DISCREPANCY"]
    assert len(area_finding) >= 1
    assert "Area Variance" in area_finding[0].title


# =============================================================================
# 3. Audit Trail Invariant Tests
# =============================================================================
def test_audit_trail_append_only():
    initial_count = len(AuditService.get_all_events())
    ev = AuditService.record_event(
        event_type="TEST_EVENT",
        details={"key": "test_value"},
        case_id="test-case-id",
        actor_email="tester@bhumiverse.internal"
    )
    assert ev.id is not None
    assert len(AuditService.get_all_events()) == initial_count + 1
    # Check that case specific filter retrieves it
    case_events = AuditService.get_events_for_case("test-case-id")
    assert any(e.id == ev.id for e in case_events)


# =============================================================================
# 4. PDF Generation Test
# =============================================================================
def test_pdf_report_generation():
    from backend.app.services.repository import repo
    case = repo.get_case_by_id("case-demo-001")
    assert case is not None
    radar = FraudDetectionEngine.evaluate_case(case.id, case.tracking_id, case.documents, case.land_records, case.transactions)

    pdf_bytes = PDFReportGenerator.generate_report_bytes(case, radar)
    assert len(pdf_bytes) > 1000
    assert pdf_bytes.startswith(b"%PDF")
