# BHUMIVerse

> **AI-Assisted Land Fraud Detection & Double-Selling Risk Analysis Platform**  
> *Tagline: Detect Conflicts. Investigate Risk. Protect Land Records.*  
> **LandTech Innovation Hackathon 2026 — Problem Statement P3: Catch Fraud & Double-Selling**

---

## 1. Executive Summary & Problem Statement

Land records in Bangladesh and South Asia often suffer from fragmented paper-based archives, delayed mutation backlogs, handwritten stamp deed variations, and separate institutional silos between the **Registration Directorate (সাব-রেজিস্ট্রি কার্যালয়)** and the **Directorate of Land Records & Surveys / Assistant Commissioner (Land) (এসিল্যান্ড ও ভূমি রেকর্ড বাতায়ন)**.

These systemic vulnerabilities are frequently exploited through:
1. **Double-Selling / Multiple Conveyance (দ্বৈত বিক্রয়):** The same plot/dag is sold to multiple unsuspecting buyers before mutation records update.
2. **Registration vs. Mutation Mismatch (দলিল ও নামজারি অসঙ্গতি):** Discrepancies between deed dag/khatian numbers and mutation schedules.
3. **Altered Photocopy Fraud (পরিমার্জিত বা জাল কপি):** Manipulated deed photocopies presented with altered buyer names or dates.
4. **Land Area Discrepancy (জমির পরিমাপে অসঙ্গতি):** Exaggerated plot claims beyond legal ceiling or unrecorded road deductions.
5. **Timeline Inversions (অসঙ্গতিপূর্ণ সময়ক্রম):** Deeds registered before purported execution or unlinked succession chains.

**BHUMIVerse** solves this by providing a deterministic, transparent, and explainable AI/OCR-assisted screening platform. It does not replace authorized land officials or make unsupported legal declarations; rather, it empowers reviewers with an **Explainable Fraud Radar**, **Smart Document Diff**, **Fraud Network Graph**, and **Land Transaction Timeline**.

---

## 2. Core Architecture & System Diagram

```
                                  [ Citizen / Landowner ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
            [ Public Verification Portal ]               [ Officer Review Console ]
            (Next.js App Router, Tailwind)              (Case Queue, Approvals, RLS)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │ REST API / CORS
                                             ▼
                                  [ FastAPI Backend ]
                                             │
      ┌───────────────────┬──────────────────┼───────────────────┬──────────────────┐
      ▼                   ▼                  ▼                   ▼                  ▼
[ OCR Service ]    [ Normalizer ]     [ Fraud Engine ]    [ Graph Builder ]  [ PDF Report ]
PaddleOCR/Tesseract Bangla/English     Rules A through H   Network Entities   ReportLab Engine
Sha-256 Hashes     Numerals & Units   Deterministic Risk  Plots, Deeds, Txns Audit Disclaimer
      │                   │                  │                   │                  │
      └───────────────────┴──────────────────┼───────────────────┴──────────────────┘
                                             │
                                             ▼
                       [ PostgreSQL / Supabase Private Store ]
                       - Row Level Security (RLS)
                       - Append-Only Immutable Audit Trail
                       - 20+ Seeded Synthetic Cases
```

---

## 3. Technology Stack

- **Frontend:**
  - Next.js 16+ (App Router with Server & Client Components)
  - TypeScript
  - Tailwind CSS with custom legal-tech dark navy & emerald design tokens
  - Lucide React Icons
- **Backend:**
  - Python 3.12+ with FastAPI
  - Pydantic v2 schemas and validation
  - ReportLab PDF generator
  - Pytest automated unit and integration test suite
- **Database & Authentication:**
  - PostgreSQL schema with version-controlled migrations (`backend/supabase/schema.sql`)
  - Supabase Auth with Row Level Security (RLS)
  - Fallback local in-memory persistence for seamless evaluation in offline/demo environments
- **Integrity & Auditing:**
  - SHA-256 cryptographic document hashing
  - Append-only immutable audit trail for security and review decisions

---

## 4. Rule Engine (Rules A through H)

BHUMIVerse operates strictly on transparent, testable rules rather than opaque black-box probability:

| Rule ID | Name | Description | Severity |
|---|---|---|---|
| **RULE A** | Duplicate File | Flags identical SHA-256 cryptographic file hashes within and across cases | Low / Medium |
| **RULE B** | Potential Double-Selling | Detects multiple conflicting sale deeds to different buyers on the identical normalized plot | High |
| **RULE C** | Reg-Mutation Mismatch | Compares deed plot/khatian/area against mutation record; returns "Insufficient Data" if only one is present | High / Info |
| **RULE D** | Land Area Variance | Normalizes decimals (শতক), katha, bigha, and acres; flags discrepancies exceeding 3% | High / Medium |
| **RULE E** | Missing Critical Metadata | Detects unreadable or missing essential fields (Dag, Khatian, Mouza); classifies as Incomplete Info, NOT fraud | Low / Info |
| **RULE F** | Low OCR Confidence | Flags fields with scan confidence < 70% for manual human review while preserving original values | Info |
| **RULE G** | Altered Document Copy | Compares matching deed serial numbers across versions with divergent buyer names or dates | High |
| **RULE H** | Inconsistent Timeline | Analyzes chronological sequence; flags registrations preceding execution or unlinked succession | Medium / Low |

---

## 5. Folder Structure

```
BHUMIverse/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin.py          # Admin metrics, case review, audit logs, global graph
│   │   │   ├── analysis.py       # Fraud radar, smart diff, network graph, timeline
│   │   │   ├── auth.py           # Sign up, sign in, email verification, me
│   │   │   ├── cases.py          # Case creation, listing, retrieval
│   │   │   ├── documents.py      # File upload, validation, field manual correction
│   │   │   └── reports.py        # Streaming PDF risk reports
│   │   ├── data/
│   │   │   └── synthetic_dataset.py # 20+ realistic seeded Bangladeshi land cases
│   │   ├── models/
│   │   │   └── schemas.py        # Pydantic v2 domain schemas
│   │   ├── services/
│   │   │   ├── audit_service.py  # Immutable append-only audit trail logger
│   │   │   ├── fraud_engine.py   # Deterministic rules A through H detection engine
│   │   │   ├── graph_builder.py  # Entity relationship graph constructor
│   │   │   ├── normalizer.py     # Bengali numerals, land units, and name guard
│   │   │   ├── ocr_service.py    # Multi-engine adapter & SHA-256 hasher
│   │   │   ├── pdf_generator.py  # ReportLab PDF generator
│   │   │   └── repository.py     # In-memory store & query engine
│   │   ├── tests/
│   │   │   └── test_bhumiverse.py # 9 automated tests for rules & normalization
│   │   ├── config.py
│   │   └── main.py
│   ├── supabase/
│   │   └── schema.sql            # PostgreSQL tables, constraints, indexes & RLS
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # Public landing page
│   │   │   ├── features/page.tsx # Rules A to H documentation
│   │   │   ├── how-it-works/page.tsx # Workflow pipeline
│   │   │   ├── demo/page.tsx     # Dedicated judge evaluation sandbox
│   │   │   ├── auth/             # Sign in, Sign up, Verify email, Forgot password
│   │   │   ├── dashboard/        # Citizen dashboard, new verification, cases, hub
│   │   │   └── admin/            # Admin review console, metrics, graph, audit logs
│   │   ├── components/
│   │   │   ├── diff/SmartDocumentDiff.tsx
│   │   │   ├── graph/FraudNetworkGraph.tsx
│   │   │   ├── layout/Navbar.tsx & Footer.tsx
│   │   │   ├── radar/ExplainableRadar.tsx
│   │   │   ├── timeline/TransactionTimeline.tsx
│   │   │   └── ui/StatusBadge.tsx & RiskBadge.tsx
│   │   └── lib/
│   │       ├── api.ts            # Client API service with offline fallback
│   │       ├── mockData.ts       # 20 pre-seeded client cases
│   │       └── types.ts          # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.ts
│   └── .env.example
├── implementation_plan.md
└── README.md
```

---

## 6. Quick Start & Local Run Instructions

### Prerequisites
- Python 3.12+
- Node.js 18+ & npm
- Git

### 1. Backend Setup & Run
```bash
# From workspace root
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Run automated tests
python -m pytest app/tests/test_bhumiverse.py -v -p no:cacheprovider

# Start FastAPI server (Port 8000)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API Swagger Documentation will be available at:* `http://localhost:8000/docs`

### 2. Frontend Setup & Run
```bash
# In a new terminal, from workspace root
cd frontend

# Install packages
npm install

# Start Next.js development server (Port 3000)
npm run dev
```
*Web Application will be available at:* `http://localhost:3000`

---

## 7. Demo Evaluation Accounts & Scenarios

For rapid hackathon evaluation without manual typing, the application features a **1-click Role Switcher** and pre-seeded test scenarios:

### Roles:
- **Citizen / Landowner:** `citizen@bhumiverse.internal` (Accesses Citizen Dashboard, New Verification Wizard, Personal Cases, and PDF Reports)
- **Admin / Land Officer:** `admin@bhumiverse.internal` (Accesses Admin Console, Case Review Modal, Global Graph, Audit Logs, and Dataset Reset)

### Pre-Seeded Scenarios (Available on `/demo`):
1. **Case BV-2026-0002:** Potential Double-Selling on Dag 405 (Joar Sahara, Gulshan) — Sold to Kabir Ahmed (2020) and Tariqul Islam (2023) by same seller without revocation.
2. **Case BV-2026-0001:** Clean Legitimate Title on Dag 1025 (Baunia, Savar) — Perfect deed & mutation alignment; approved workflow.
3. **Case BV-2026-0003:** Registration-Mutation Mismatch on Dag 750 vs Dag 820 (Tejgaon) — Discrepant plot identifiers and area.
4. **Case BV-2026-0004:** Cryptographic Duplicate File Upload — Exact SHA-256 hash collision matching Case BV-2026-0001.
5. **Case BV-2026-0005:** Land Area Discrepancy — 37.5% area variance (20.0 decimals vs 12.5 decimals).
6. **Case BV-2026-0008:** Altered Document Photocopy — Same deed serial with divergent buyer names inserted.

---

## 8. Responsible AI & Legal Limitations Notice

> [!IMPORTANT]
> **Mandatory Legal Disclaimer:**  
> This platform is an automated risk screening aid (Screening Aid) intended for prioritization. It **does NOT** conclusively establish legal land ownership or prove fraud from an uploaded document alone. All automated results are risk indicators; final determinations strictly belong to an authorized human reviewer (AC Land, Sub-Registrar, or Surveyor).
> 
> All records in the evaluation dataset are explicitly tagged:  
> **`DEMO DATA — NOT AN OFFICIAL LAND RECORD`**  
> No real citizen NID numbers, phone numbers, or actual confidential government records are utilized.

---

## 9. Future Implementation Roadmap

The following capabilities are excluded from the current MVP and documented for future technical phases:
- **Sub-Registrar QR-Code Automated Parsing:** Direct scanning and verification of official digital seals once authorized APIs are made accessible.
- **Cadastral Blockchain Integrity Mechanisms:** Immutable distributed ledgers for cross-district deed validation.
- **Direct Government Database Integrations:** Official APIs for DLRMS (Directorate of Land Records and Surveys) and LDTax portal.
- **Deep Multilingual Bengla Handwriting Recognition:** Specialized transformer models for faded palm-leaf and colonial-era hand scripts.

---

## 10. License & Hackathon Attribution

Developed for the **LandTech Innovation Hackathon 2026**.  
Built with Next.js, FastAPI, ReportLab, and PostgreSQL/Supabase.
