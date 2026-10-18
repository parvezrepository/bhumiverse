"""
Deterministic, Explainable Rule-Based Fraud & Double-Selling Risk Detection Engine.
Rules:
- RULE_A_DUPLICATE_FILE: Identical SHA-256 hashes detected.
- RULE_B_DOUBLE_SELLING: Same plot involved in multiple conflicting buyer sale transactions.
- RULE_C_REG_MUTATION_MISMATCH: Discrepancy between Registered Deed and Mutation Record.
- RULE_D_AREA_DISCREPANCY: Land area exceeds tolerance threshold across related documents.
- RULE_E_MISSING_CRITICAL_FIELDS: Missing essential identifiers (Khatian, Dag, or Mouza).
- RULE_F_OCR_UNCERTAINTY: Extracted field confidence is below verification threshold.
- RULE_G_DOCUMENT_DIFFERENCES: Unsynchronized modifications between versions of document.
- RULE_H_TIMELINE_INCONSISTENCY: Chronological order of transfers exhibits anomalies or gaps.
"""

import uuid
from datetime import datetime, date
from typing import List, Dict, Any, Optional, Tuple
from backend.app.services.normalizer import (
    normalize_numerals,
    normalize_identifier,
    normalize_plot_composite_key,
    normalize_land_area,
    are_names_plausibly_different
)
from backend.app.models.schemas import (
    Finding,
    FindingEvidence,
    SeverityEnum,
    RiskLevelEnum,
    DocumentItem,
    LandRecord,
    TransactionRecord,
    ExtractedField,
    ExplainableFraudRadar
)


class FraudDetectionEngine:
    """
    High-integrity rule evaluation engine.
    Does not produce arbitrary probabilistic outputs; strictly reports evidence-backed findings.
    """

    AREA_TOLERANCE_PERCENT = 3.0  # 3% tolerance for surveying variances
    OCR_CONFIDENCE_THRESHOLD = 0.70

    @classmethod
    def evaluate_case(
        cls,
        case_id: str,
        tracking_id: str,
        documents: List[DocumentItem],
        land_records: List[LandRecord],
        transactions: List[TransactionRecord],
        all_system_documents: Optional[List[DocumentItem]] = None,
        all_system_transactions: Optional[List[TransactionRecord]] = None
    ) -> ExplainableFraudRadar:
        """
        Runs complete evaluation suite across provided case and cross-case historical repository.
        """
        findings: List[Finding] = []
        now = datetime.now()

        # Context pools
        sys_docs = all_system_documents or []
        sys_txns = all_system_transactions or []

        # ---------------------------------------------------------------------
        # RULE A: Duplicate File Hash Detection
        # ---------------------------------------------------------------------
        findings.extend(cls._check_rule_a_duplicate_files(case_id, documents, sys_docs, now))

        # ---------------------------------------------------------------------
        # RULE B: Potential Double-Selling Risk
        # ---------------------------------------------------------------------
        findings.extend(cls._check_rule_b_double_selling(case_id, land_records, transactions, sys_txns, now))

        # ---------------------------------------------------------------------
        # RULE C: Registration vs Mutation Record Mismatch
        # ---------------------------------------------------------------------
        findings.extend(cls._check_rule_c_registration_mutation_mismatch(case_id, documents, land_records, now))

        # ---------------------------------------------------------------------
        # RULE D: Conflicting Land Area
        # ---------------------------------------------------------------------
        findings.extend(cls._check_rule_d_land_area_discrepancy(case_id, documents, land_records, now))

        # ---------------------------------------------------------------------
        # RULE E: Missing Critical Fields (Incomplete Information)
        # ---------------------------------------------------------------------
        findings.extend(cls._check_rule_e_missing_critical_fields(case_id, documents, land_records, now))

        # ---------------------------------------------------------------------
        # RULE F: OCR Uncertainty & Low Confidence
        # ---------------------------------------------------------------------
        findings.extend(cls._check_rule_f_ocr_uncertainty(case_id, documents, now))

        # ---------------------------------------------------------------------
        # RULE G: Suspicious Document Differences
        # ---------------------------------------------------------------------
        findings.extend(cls._check_rule_g_document_differences(case_id, documents, now))

        # ---------------------------------------------------------------------
        # RULE H: Inconsistent Transaction Timeline
        # ---------------------------------------------------------------------
        findings.extend(cls._check_rule_h_timeline_inconsistency(case_id, transactions, now))

        # ---------------------------------------------------------------------
        # Aggregate Risk Level Determination
        # ---------------------------------------------------------------------
        overall_risk, risk_score = cls._compute_overall_risk(findings, len(documents))

        recommended_checks = cls._compile_recommended_checks(findings)

        return ExplainableFraudRadar(
            case_id=case_id,
            tracking_id=tracking_id,
            overall_risk_level=overall_risk,
            risk_score_numeric=risk_score,
            findings_count=len(findings),
            critical_conflicts_count=sum(1 for f in findings if f.severity in (SeverityEnum.HIGH, SeverityEnum.MEDIUM)),
            findings=findings,
            recommended_checks=recommended_checks
        )

    # =========================================================================
    # Rule Implementations
    # =========================================================================

    @classmethod
    def _check_rule_a_duplicate_files(
        cls,
        case_id: str,
        current_docs: List[DocumentItem],
        system_docs: List[DocumentItem],
        now: datetime
    ) -> List[Finding]:
        findings = []
        seen_hashes: Dict[str, DocumentItem] = {}

        # 1. Within current case
        for doc in current_docs:
            h = doc.file_hash_sha256
            if h in seen_hashes:
                other = seen_hashes[h]
                findings.append(Finding(
                    id=str(uuid.uuid4()),
                    case_id=case_id,
                    rule_id="RULE_A_DUPLICATE_FILE",
                    finding_type="Duplicate File Upload Detected",
                    severity=SeverityEnum.LOW,
                    title="Identical File Uploaded Multiple Times in Same Case",
                    explanation=(
                        f"Document '{doc.file_name}' has an identical SHA-256 hash "
                        f"({h[:12]}...) to document '{other.file_name}'. "
                        "Note: An identical file is not proof of fraud, but represents redundant submission."
                    ),
                    conflicting_values={
                        "doc1_name": other.file_name,
                        "doc2_name": doc.file_name,
                        "sha256": h
                    },
                    recommended_action="Review uploaded documents and archive redundant file if unnecessary.",
                    detected_at=now,
                    evidence=[
                        FindingEvidence(document_id=other.id, snippet=f"File: {other.file_name} (Hash: {h[:12]}...)"),
                        FindingEvidence(document_id=doc.id, snippet=f"File: {doc.file_name} (Hash: {h[:12]}...)")
                    ]
                ))
            else:
                seen_hashes[h] = doc

        # 2. Across distinct previous cases in system
        for doc in current_docs:
            for s_doc in system_docs:
                if s_doc.case_id != case_id and s_doc.file_hash_sha256 == doc.file_hash_sha256:
                    findings.append(Finding(
                        id=str(uuid.uuid4()),
                        case_id=case_id,
                        rule_id="RULE_A_DUPLICATE_FILE",
                        finding_type="Cross-Case Duplicate File Detected",
                        severity=SeverityEnum.MEDIUM,
                        title="Document Exact Match Found in Another Case",
                        explanation=(
                            f"Uploaded file '{doc.file_name}' shares exact cryptographic hash with "
                            f"file '{s_doc.file_name}' previously submitted under Case ID {s_doc.case_id[:8]}. "
                            "Requires verification to confirm whether this is a legitimate re-submission or duplicate claim."
                        ),
                        conflicting_values={
                            "current_case_file": doc.file_name,
                            "prior_case_id": s_doc.case_id,
                            "sha256": doc.file_hash_sha256
                        },
                        recommended_action="Inspect linked prior case record to ensure title has not already been processed or contested.",
                        detected_at=now,
                        evidence=[
                            FindingEvidence(document_id=doc.id, snippet=f"Current: {doc.file_name}"),
                            FindingEvidence(document_id=s_doc.id, snippet=f"Prior Case Doc: {s_doc.file_name}")
                        ]
                    ))
        return findings

    @classmethod
    def _check_rule_b_double_selling(
        cls,
        case_id: str,
        land_records: List[LandRecord],
        transactions: List[TransactionRecord],
        system_txns: List[TransactionRecord],
        now: datetime
    ) -> List[Finding]:
        findings = []
        all_txns = list(transactions) + [t for t in system_txns if t.case_id != case_id]

        for lr in land_records:
            comp_key = normalize_plot_composite_key(
                lr.district, lr.upazila, lr.mouza, lr.khatian_no, lr.dag_no
            )

            # Find all transactions mentioning this normalized plot
            matching_txns = [
                t for t in all_txns
                if normalize_identifier(t.plot_identifier) == normalize_identifier(comp_key)
                or (lr.dag_no and f"DAG-{normalize_identifier(lr.dag_no)}" in t.plot_identifier)
            ]

            # Compare pairs of sales on same plot
            for i in range(len(matching_txns)):
                for j in range(i + 1, len(matching_txns)):
                    t1 = matching_txns[i]
                    t2 = matching_txns[j]

                    # Check if buyers are distinct individuals
                    diff_buyers, diff_reason = are_names_plausibly_different(t1.buyer_name, t2.buyer_name)

                    if diff_buyers and t1.buyer_name and t2.buyer_name:
                        # Check seller continuity or identical seller selling to 2 different parties
                        is_same_seller = False
                        if t1.seller_name and t2.seller_name:
                            diff_sellers, _ = are_names_plausibly_different(t1.seller_name, t2.seller_name)
                            is_same_seller = not diff_sellers

                        t1_date_str = str(t1.transaction_date) if t1.transaction_date else "Unknown Date"
                        t2_date_str = str(t2.transaction_date) if t2.transaction_date else "Unknown Date"

                        findings.append(Finding(
                            id=str(uuid.uuid4()),
                            case_id=case_id,
                            rule_id="RULE_B_DOUBLE_SELLING",
                            finding_type="Potential Double-Selling Conflict",
                            severity=SeverityEnum.HIGH,
                            title=f"Multiple Conflicting Sale Transactions on Dag {lr.dag_no}",
                            explanation=(
                                f"Plot Dag {lr.dag_no} (Mouza {lr.mouza}, Khatian {lr.khatian_no}) appears in separate "
                                f"sale records to two distinct buyers: '{t1.buyer_name}' ({t1_date_str}) and "
                                f"'{t2.buyer_name}' ({t2_date_str}). "
                                f"{'Both deeds list the same seller (' + str(t1.seller_name) + '), indicating an unverified second conveyance.' if is_same_seller else 'Seller chain lacks clear succession documentation.'} "
                                "This is a strong risk indicator requiring urgent deed chain inspection."
                            ),
                            conflicting_values={
                                "plot_dag": lr.dag_no,
                                "plot_mouza": lr.mouza,
                                "plot_khatian": lr.khatian_no,
                                "buyer_1": t1.buyer_name,
                                "transaction_1_date": t1_date_str,
                                "deed_1": t1.deed_no or "N/A",
                                "buyer_2": t2.buyer_name,
                                "transaction_2_date": t2_date_str,
                                "deed_2": t2.deed_no or "N/A"
                            },
                            recommended_action=(
                                "Request Sub-Registrar volume book verification (বালাম বহি) "
                                "and mutation record to confirm whether Deed 1 was revoked or if Plot was subdivided."
                            ),
                            detected_at=now,
                            evidence=[
                                FindingEvidence(snippet=f"Deed {t1.deed_no or 'N/A'}: Sold to {t1.buyer_name} on {t1_date_str}"),
                                FindingEvidence(snippet=f"Deed {t2.deed_no or 'N/A'}: Sold to {t2.buyer_name} on {t2_date_str}")
                            ]
                        ))
        return findings

    @classmethod
    def _check_rule_c_registration_mutation_mismatch(
        cls,
        case_id: str,
        documents: List[DocumentItem],
        land_records: List[LandRecord],
        now: datetime
    ) -> List[Finding]:
        findings = []

        deed_docs = [d for d in documents if d.doc_category == "deed"]
        mutation_docs = [d for d in documents if d.doc_category == "mutation_record"]

        if not deed_docs or not mutation_docs:
            # When one is missing, rule specifies: report Insufficient Data, do NOT declare mismatch
            findings.append(Finding(
                id=str(uuid.uuid4()),
                case_id=case_id,
                rule_id="RULE_C_REG_MUTATION_MISMATCH",
                finding_type="Insufficient Records for Cross-Verification",
                severity=SeverityEnum.INFO,
                title="Insufficient Records: Mutation Record or Registered Deed Pending Submission",
                explanation=(
                    f"Cross-document comparison between Registered Deed and Mutation (নামজারি খতিয়ান) could not be completed "
                    f"because only {'Registered Deed' if deed_docs else 'Mutation Record'} was uploaded. "
                    "In Bangladesh land governance, title completeness requires alignment between Sub-Registrar deed and AC Land mutation."
                ),
                conflicting_values={
                    "deeds_available": len(deed_docs),
                    "mutation_available": len(mutation_docs),
                    "status": "INSUFFICIENT_DATA"
                },
                recommended_action="Submit corresponding Mutation Dakhila / Khatian or e-Namjari clearance to enable full cross-validation.",
                detected_at=now
            ))
            return findings

        # When both exist, compare extracted Dag, Khatian, and Land Area
        for d_doc in deed_docs:
            d_dag = next((f.normalized_value for f in d_doc.extracted_fields if f.field_name == "dag_no"), None)
            d_khatian = next((f.normalized_value for f in d_doc.extracted_fields if f.field_name == "khatian_no"), None)
            d_area = next((f.normalized_value for f in d_doc.extracted_fields if f.field_name == "land_area"), None)

            for m_doc in mutation_docs:
                m_dag = next((f.normalized_value for f in m_doc.extracted_fields if f.field_name == "dag_no"), None)
                m_khatian = next((f.normalized_value for f in m_doc.extracted_fields if f.field_name == "khatian_no"), None)
                m_area = next((f.normalized_value for f in m_doc.extracted_fields if f.field_name == "land_area"), None)

                # Dag mismatch
                if d_dag and m_dag and normalize_identifier(d_dag) != normalize_identifier(m_dag):
                    findings.append(Finding(
                        id=str(uuid.uuid4()),
                        case_id=case_id,
                        rule_id="RULE_C_REG_MUTATION_MISMATCH",
                        finding_type="Plot Identifier Discrepancy",
                        severity=SeverityEnum.HIGH,
                        title=f"Mismatched Dag Number Between Deed and Mutation",
                        explanation=(
                            f"Registered Deed specifies Dag '{d_dag}', whereas the submitted Mutation record "
                            f"lists Dag '{m_dag}'. Mutation must directly cite the parent deed plot."
                        ),
                        conflicting_values={
                            "deed_dag": d_dag,
                            "mutation_dag": m_dag,
                            "deed_file": d_doc.file_name,
                            "mutation_file": m_doc.file_name
                        },
                        recommended_action="Verify AC Land mutation proposal sheet (নামজারি প্রস্তাবপত্র) to verify if dag renumbering occurred.",
                        detected_at=now,
                        evidence=[
                            FindingEvidence(document_id=d_doc.id, snippet=f"Deed lists Dag: {d_dag}"),
                            FindingEvidence(document_id=m_doc.id, snippet=f"Mutation lists Dag: {m_dag}")
                        ]
                    ))
        return findings

    @classmethod
    def _check_rule_d_land_area_discrepancy(
        cls,
        case_id: str,
        documents: List[DocumentItem],
        land_records: List[LandRecord],
        now: datetime
    ) -> List[Finding]:
        findings = []
        parsed_areas = []

        for doc in documents:
            area_field = next((f for f in doc.extracted_fields if f.field_name == "land_area"), None)
            if area_field and area_field.original_value:
                norm_res = normalize_land_area(area_field.original_value)
                if norm_res["decimals"] is not None and norm_res["is_reliable"]:
                    parsed_areas.append((doc, norm_res["decimals"], area_field.original_value))

        for i in range(len(parsed_areas)):
            for j in range(i + 1, len(parsed_areas)):
                doc1, area1, raw1 = parsed_areas[i]
                doc2, area2, raw2 = parsed_areas[j]

                diff = abs(area1 - area2)
                percent_diff = (diff / max(area1, area2)) * 100.0 if max(area1, area2) > 0 else 0

                if percent_diff > cls.AREA_TOLERANCE_PERCENT and diff >= 0.2:
                    severity = SeverityEnum.HIGH if percent_diff > 15.0 else SeverityEnum.MEDIUM
                    findings.append(Finding(
                        id=str(uuid.uuid4()),
                        case_id=case_id,
                        rule_id="RULE_D_AREA_DISCREPANCY",
                        finding_type="Land Area Inconsistency",
                        severity=severity,
                        title=f"Significant Area Variance ({diff:.2f} decimals / {percent_diff:.1f}%)",
                        explanation=(
                            f"Land area in '{doc1.file_name}' ({raw1} ≈ {area1:.2f} decimals) differs from "
                            f"'{doc2.file_name}' ({raw2} ≈ {area2:.2f} decimals) by {diff:.2f} decimals. "
                            "Notice: Survey discrepancies, road widening deductions, or unrecorded subdivisions may account for minor variations; "
                            "discrepancies above threshold require field surveyor / Amin measurement verification."
                        ),
                        conflicting_values={
                            "doc1_name": doc1.file_name,
                            "doc1_area_decimal": area1,
                            "doc2_name": doc2.file_name,
                            "doc2_area_decimal": area2,
                            "difference_decimal": round(diff, 2),
                            "percentage_difference": round(percent_diff, 1)
                        },
                        recommended_action="Inspect field sketch map (নকশা/ট্রেস ম্যাপ) and mouza survey register for legal deduction records.",
                        detected_at=now,
                        evidence=[
                            FindingEvidence(document_id=doc1.id, snippet=f"{doc1.file_name}: {raw1}"),
                            FindingEvidence(document_id=doc2.id, snippet=f"{doc2.file_name}: {raw2}")
                        ]
                    ))
        return findings

    @classmethod
    def _check_rule_e_missing_critical_fields(
        cls,
        case_id: str,
        documents: List[DocumentItem],
        land_records: List[LandRecord],
        now: datetime
    ) -> List[Finding]:
        findings = []
        critical_fields = ["dag_no", "khatian_no", "mouza"]

        for doc in documents:
            present_fields = {f.field_name for f in doc.extracted_fields if f.normalized_value}
            missing = [cf for cf in critical_fields if cf not in present_fields]

            if missing:
                findings.append(Finding(
                    id=str(uuid.uuid4()),
                    case_id=case_id,
                    rule_id="RULE_E_MISSING_CRITICAL_FIELDS",
                    finding_type="Incomplete Document Metadata",
                    severity=SeverityEnum.LOW,
                    title=f"Critical Field(s) Unidentified in '{doc.file_name}'",
                    explanation=(
                        f"Document '{doc.file_name}' is missing essential land parcel identifiers: {', '.join(missing)}. "
                        "Without these fields, deterministic automated title verification cannot be completed. "
                        "This indicates incomplete record entry or occluded scan quality, NOT confirmed fraud."
                    ),
                    conflicting_values={"missing_fields": missing, "file_name": doc.file_name},
                    recommended_action="Use manual structured correction or upload an un-obscured scan of the document schedule page.",
                    detected_at=now,
                    evidence=[FindingEvidence(document_id=doc.id, snippet=f"File: {doc.file_name}")]
                ))
        return findings

    @classmethod
    def _check_rule_f_ocr_uncertainty(
        cls,
        case_id: str,
        documents: List[DocumentItem],
        now: datetime
    ) -> List[Finding]:
        findings = []

        for doc in documents:
            low_conf_fields = [
                f for f in doc.extracted_fields
                if f.confidence < cls.OCR_CONFIDENCE_THRESHOLD and not f.is_manually_corrected
            ]

            if low_conf_fields:
                field_names = [f.field_name for f in low_conf_fields]
                findings.append(Finding(
                    id=str(uuid.uuid4()),
                    case_id=case_id,
                    rule_id="RULE_F_OCR_UNCERTAINTY",
                    finding_type="OCR Confidence Below Threshold",
                    severity=SeverityEnum.INFO,
                    title=f"Low OCR Confidence on {len(low_conf_fields)} Field(s)",
                    explanation=(
                        f"Fields ({', '.join(field_names)}) extracted from '{doc.file_name}' scored confidence "
                        f"below {int(cls.OCR_CONFIDENCE_THRESHOLD * 100)}%. Degraded stamp paper, cursive Bangla ink, or low scanner resolution "
                        "may cause character misrecognition. Manual human verification is requested."
                    ),
                    conflicting_values={
                        "low_confidence_fields": [
                            {"name": f.field_name, "val": f.original_value, "confidence": f.confidence}
                            for f in low_conf_fields
                        ]
                    },
                    recommended_action="Confirm extracted numbers against visual document viewer before submitting final review.",
                    detected_at=now,
                    evidence=[FindingEvidence(document_id=doc.id, snippet=f"Confidence: {round(f.confidence, 2)} for {f.field_name}") for f in low_conf_fields[:3]]
                ))
        return findings

    @classmethod
    def _check_rule_g_document_differences(
        cls,
        case_id: str,
        documents: List[DocumentItem],
        now: datetime
    ) -> List[Finding]:
        findings = []

        # Compare documents with identical deed numbers but different dates or buyer/seller
        deeds = [d for d in documents if d.doc_category == "deed"]
        for i in range(len(deeds)):
            for j in range(i + 1, len(deeds)):
                d1, d2 = deeds[i], deeds[j]
                d1_deed = next((f.normalized_value for f in d1.extracted_fields if f.field_name == "deed_no"), None)
                d2_deed = next((f.normalized_value for f in d2.extracted_fields if f.field_name == "deed_no"), None)

                if d1_deed and d2_deed and normalize_identifier(d1_deed) == normalize_identifier(d2_deed):
                    # Same deed number, check if dates or parties differ
                    d1_buyer = next((f.normalized_value for f in d1.extracted_fields if f.field_name == "buyer_name"), "")
                    d2_buyer = next((f.normalized_value for f in d2.extracted_fields if f.field_name == "buyer_name"), "")

                    diff_buyers, _ = are_names_plausibly_different(d1_buyer, d2_buyer)
                    if diff_buyers and d1_buyer and d2_buyer:
                        findings.append(Finding(
                            id=str(uuid.uuid4()),
                            case_id=case_id,
                            rule_id="RULE_G_DOCUMENT_DIFFERENCES",
                            finding_type="Altered Document Copy Discrepancy",
                            severity=SeverityEnum.HIGH,
                            title=f"Conflicting Information in Matching Deed No {d1_deed}",
                            explanation=(
                                f"Two submitted copies purport to represent the same Deed No. {d1_deed}, "
                                f"yet specify conflicting buyer parties ('{d1_buyer}' vs '{d2_buyer}'). "
                                "This pattern indicates a potentially manipulated, doctored, or forged photocopy copy."
                            ),
                            conflicting_values={
                                "deed_no": d1_deed,
                                "doc1": d1.file_name,
                                "doc1_buyer": d1_buyer,
                                "doc2": d2.file_name,
                                "doc2_buyer": d2_buyer
                            },
                            recommended_action="Submit deed copies to Forensic Document Examination and request certified copy from District Sub-Registry.",
                            detected_at=now,
                            evidence=[
                                FindingEvidence(document_id=d1.id, snippet=f"{d1.file_name}: Buyer is {d1_buyer}"),
                                FindingEvidence(document_id=d2.id, snippet=f"{d2.file_name}: Buyer is {d2_buyer}")
                            ]
                        ))
        return findings

    @classmethod
    def _check_rule_h_timeline_inconsistency(
        cls,
        case_id: str,
        transactions: List[TransactionRecord],
        now: datetime
    ) -> List[Finding]:
        findings = []
        if len(transactions) < 2:
            return findings

        # Sort transactions by date if available
        dated_txns = [t for t in transactions if t.transaction_date]
        dated_txns.sort(key=lambda x: x.transaction_date)

        for i in range(len(dated_txns) - 1):
            t1 = dated_txns[i]
            t2 = dated_txns[i + 1]

            # Inversion check: If registration date is earlier than execution date, or mutation precedes deed
            if t1.registration_date and t1.transaction_date and t1.registration_date < t1.transaction_date:
                findings.append(Finding(
                    id=str(uuid.uuid4()),
                    case_id=case_id,
                    rule_id="RULE_H_TIMELINE_INCONSISTENCY",
                    finding_type="Timeline Inversion Anomaly",
                    severity=SeverityEnum.MEDIUM,
                    title="Registration Date Precedes Execution Date",
                    explanation=(
                        f"Deed {t1.deed_no or 'N/A'} lists registration date ({t1.registration_date}) prior to "
                        f"execution date ({t1.transaction_date}). Formal registration cannot lawfully precede execution."
                    ),
                    conflicting_values={
                        "execution_date": str(t1.transaction_date),
                        "registration_date": str(t1.registration_date),
                        "deed_no": t1.deed_no or "N/A"
                    },
                    recommended_action="Verify Sub-Registrar endorsement seal and serial date in index book.",
                    detected_at=now
                ))

            # Seller succession gap: If buyer of t1 is not seller of t2 for consecutive conveyance of same plot
            if t1.buyer_name and t2.seller_name:
                diff, _ = are_names_plausibly_different(t1.buyer_name, t2.seller_name)
                if diff:
                    findings.append(Finding(
                        id=str(uuid.uuid4()),
                        case_id=case_id,
                        rule_id="RULE_H_TIMELINE_INCONSISTENCY",
                        finding_type="Ownership Chain Gap",
                        severity=SeverityEnum.LOW,
                        title=f"Unlinked Succession in Timeline ({t1.buyer_name} -> {t2.seller_name})",
                        explanation=(
                            f"Plot was conveyed to '{t1.buyer_name}' on {t1.transaction_date}, but subsequent transfer "
                            f"on {t2.transaction_date} lists seller as '{t2.seller_name}'. Intermediate inheritance (ওয়ারিশনামা), "
                            "power of attorney (আমমোক্তারনামা), or intervening conveyance deed is unrecorded."
                        ),
                        conflicting_values={
                            "previous_buyer": t1.buyer_name,
                            "next_seller": t2.seller_name,
                            "interval": f"{t1.transaction_date} to {t2.transaction_date}"
                        },
                        recommended_action="Request Warishan certificate or linking via-deeds (বায়া দলিল) to complete ownership chain.",
                        detected_at=now
                    ))
        return findings

    # =========================================================================
    # Aggregation & Scoring
    # =========================================================================

    @staticmethod
    def _compute_overall_risk(findings: List[Finding], doc_count: int) -> Tuple[str, int]:
        """
        Calculates prioritization score (0-100) and discrete risk level.
        Prioritization metric only — never statistical proof of guilt.
        """
        high_count = sum(1 for f in findings if f.severity == SeverityEnum.HIGH)
        med_count = sum(1 for f in findings if f.severity == SeverityEnum.MEDIUM)
        low_count = sum(1 for f in findings if f.severity == SeverityEnum.LOW)

        # Base scoring
        score = (high_count * 35) + (med_count * 18) + (low_count * 5)
        score = min(max(score, 5 if findings else 0), 98)

        if high_count > 0:
            return (RiskLevelEnum.HIGH, score)
        elif med_count > 0:
            return (RiskLevelEnum.MEDIUM, score)
        elif low_count > 0:
            return (RiskLevelEnum.LOW, score)
        elif any(f.rule_id == "RULE_C_REG_MUTATION_MISMATCH" and "Insufficient" in f.title for f in findings):
            return (RiskLevelEnum.INSUFFICIENT_DATA, 10)
        elif doc_count == 0:
            return (RiskLevelEnum.INSUFFICIENT_DATA, 0)
        else:
            return (RiskLevelEnum.LOW, 5)

    @staticmethod
    def _compile_recommended_checks(findings: List[Finding]) -> List[str]:
        actions = []
        for f in findings:
            if f.recommended_action and f.recommended_action not in actions:
                actions.append(f.recommended_action)
        if not actions:
            actions.append("All primary rule checks passed without conflict. Verify physical revenue stamps before final approval.")
        return actions[:5]
