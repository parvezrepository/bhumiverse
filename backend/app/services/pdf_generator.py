"""
PDF Risk Report Generator for BHUMIVerse.
Generates audit-ready, downloadable risk screening reports with ReportLab.
Includes strict disclaimers, SHA-256 hashes, findings matrix, and evidence logs.
"""

import io
from datetime import datetime
from typing import Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from backend.app.models.schemas import CaseDetailResponse, ExplainableFraudRadar


class PDFReportGenerator:
    """
    Renders standardized PDF reports with professional legal-tech typography.
    """

    @classmethod
    def generate_report_bytes(
        cls,
        case: CaseDetailResponse,
        radar: ExplainableFraudRadar
    ) -> bytes:
        """
        Builds PDF in-memory and returns raw byte content.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()
        elements = []

        # Color Palette
        navy_color = colors.HexColor("#0B132B")
        emerald_color = colors.HexColor("#059669")
        slate_gray = colors.HexColor("#475569")
        amber_color = colors.HexColor("#D97706")
        crimson_color = colors.HexColor("#DC2626")
        light_bg = colors.HexColor("#F8FAFC")

        # Custom Styles
        title_style = ParagraphStyle(
            'HeaderTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            textColor=navy_color,
            spaceAfter=4
        )
        tagline_style = ParagraphStyle(
            'HeaderTagline',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=emerald_color,
            spaceAfter=15
        )
        h2_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=13,
            textColor=navy_color,
            spaceBefore=14,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            textColor=slate_gray,
            leading=13
        )
        disclaimer_style = ParagraphStyle(
            'LegalDisclaimer',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=8,
            textColor=colors.HexColor("#64748B"),
            leading=11
        )

        # 1. Header Banner
        elements.append(Paragraph("BHUMIVerse", title_style))
        elements.append(Paragraph("AI-Assisted Land Fraud Detection & Double-Selling Risk Analysis Platform", tagline_style))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=emerald_color, spaceAfter=12))

        # 2. Case Metadata Table
        meta_data = [
            [
                Paragraph(f"<b>Case Tracking ID:</b> {case.tracking_id}", body_style),
                Paragraph(f"<b>Generation Date:</b> {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}", body_style)
            ],
            [
                Paragraph(f"<b>Title:</b> {case.title}", body_style),
                Paragraph(f"<b>Workflow Status:</b> {case.status.replace('_', ' ').upper()}", body_style)
            ],
            [
                Paragraph(f"<b>Location:</b> {case.mouza or 'N/A'}, {case.upazila or 'N/A'}, {case.district or 'N/A'}", body_style),
                Paragraph(f"<b>Risk Assessment:</b> <b>{case.risk_level.upper()}</b> (Score: {radar.risk_score_numeric}/100)", body_style)
            ]
        ]
        meta_table = Table(meta_data, colWidths=[260, 260])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), light_bg),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 12))

        # 3. Documents Analyzed
        elements.append(Paragraph("1. Submitted Documents & Cryptographic Hashes", h2_style))
        doc_rows = [["Document Type", "File Name", "SHA-256 Hash", "Confidence"]]
        for d in case.documents:
            doc_rows.append([
                d.doc_category.replace('_', ' ').title(),
                d.file_name[:24],
                f"{d.file_hash_sha256[:16]}...",
                f"{int(d.confidence_score * 100)}%"
            ])
        if len(doc_rows) == 1:
            doc_rows.append(["None", "No documents uploaded", "N/A", "0%"])

        doc_table = Table(doc_rows, colWidths=[120, 150, 190, 60])
        doc_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(doc_table)
        elements.append(Spacer(1, 12))

        # 4. Explainable Fraud Findings
        elements.append(Paragraph(f"2. Automated Rule Findings ({len(radar.findings)} Detected)", h2_style))
        if not radar.findings:
            elements.append(Paragraph("No rule violations or plot conflicts detected based on submitted records.", body_style))
        else:
            finding_rows = [["Rule ID", "Severity", "Finding Title & Explanation", "Recommended Review Action"]]
            for f in radar.findings:
                sev_color = crimson_color if f.severity == "high" else (amber_color if f.severity == "medium" else emerald_color)
                finding_rows.append([
                    Paragraph(f"<b>{f.rule_id}</b>", body_style),
                    Paragraph(f"<font color='{sev_color}'><b>{f.severity.upper()}</b></font>", body_style),
                    Paragraph(f"<b>{f.title}</b><br/>{f.explanation[:220]}...", body_style),
                    Paragraph(f.recommended_action[:150], body_style)
                ])

            finding_table = Table(finding_rows, colWidths=[100, 60, 210, 150])
            finding_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ]))
            elements.append(finding_table)

        elements.append(Spacer(1, 14))

        # 5. Mandatory Legal Disclaimer
        elements.append(KeepTogether([
            HRFlowable(width="100%", thickness=1, color=colors.HexColor("#94A3B8"), spaceAfter=6),
            Paragraph("<b>MANDATORY LEGAL DISCLAIMER & LIMITATIONS:</b>", disclaimer_style),
            Paragraph(
                "This report is an automated screening aid based strictly on the sample or submitted records provided. "
                "It is NOT an official land ownership certificate, legal opinion, or conclusive proof of fraud. "
                "Findings require verification by an authorized human reviewer (AC Land / Sub-Registrar / Surveyor). "
                "BHUMIVerse does not claim direct access to official confidential government databases without express authorization.",
                disclaimer_style
            ),
            Spacer(1, 4),
            Paragraph("Generated by BHUMIVerse for LandTech Innovation Hackathon 2026. Non-official sample document.", disclaimer_style)
        ]))

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
