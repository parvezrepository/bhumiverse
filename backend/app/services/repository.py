"""
In-Memory / Database Repository for BHUMIVerse.
Houses cases, documents, reviews, profiles, and query functions.
Pre-seeded with synthetic cases and admin/citizen demo accounts.
"""

from typing import List, Optional, Dict
from datetime import datetime
from backend.app.models.schemas import (
    CaseDetailResponse,
    DocumentItem,
    LandRecord,
    TransactionRecord,
    ProfileResponse,
    CaseReviewRecord
)
from backend.app.data.synthetic_dataset import create_synthetic_cases
from backend.app.services.audit_service import AuditService


class Repository:
    _instance = None
    cases: Dict[str, CaseDetailResponse] = {}
    profiles: Dict[str, ProfileResponse] = {}

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # 1. Initialize Default Demo Profiles
        self.profiles["admin-demo-id"] = ProfileResponse(
            id="admin-demo-id",
            email="admin@bhumiverse.internal",
            full_name="Senior Landtech Reviewer (Admin)",
            role="admin",
            nid_mask="NID-8821-XXXX",
            phone_mask="+880 1711-XXXXXX",
            is_verified=True,
            created_at=datetime(2026, 1, 1),
            updated_at=datetime(2026, 1, 1)
        )
        self.profiles["citizen-demo-id"] = ProfileResponse(
            id="citizen-demo-id",
            email="citizen@bhumiverse.internal",
            full_name="Parvez Ahmed (Citizen)",
            role="citizen",
            nid_mask="NID-1982-XXXX",
            phone_mask="+880 1819-XXXXXX",
            is_verified=True,
            created_at=datetime(2026, 1, 2),
            updated_at=datetime(2026, 1, 2)
        )

        # 2. Seed Synthetic Cases
        seeded_cases = create_synthetic_cases()
        for c in seeded_cases:
            self.cases[c.id] = c
            # Log audit event for dataset seeding
            AuditService.record_event(
                event_type="CASE_SEEDED",
                details={"tracking_id": c.tracking_id, "title": c.title, "risk_level": c.risk_level},
                case_id=c.id,
                actor_email="system@bhumiverse.internal"
            )

    def get_all_cases(self) -> List[CaseDetailResponse]:
        return list(self.cases.values())

    def get_case_by_id(self, case_id: str) -> Optional[CaseDetailResponse]:
        # Support search by UUID id or tracking_id
        if case_id in self.cases:
            return self.cases[case_id]
        for c in self.cases.values():
            if c.tracking_id.lower() == case_id.lower():
                return c
        return None

    def add_case(self, case: CaseDetailResponse):
        self.cases[case.id] = case

    def update_case(self, case: CaseDetailResponse):
        self.cases[case.id] = case

    def get_all_documents(self) -> List[DocumentItem]:
        docs = []
        for c in self.cases.values():
            docs.extend(c.documents)
        return docs

    def get_all_transactions(self) -> List[TransactionRecord]:
        txns = []
        for c in self.cases.values():
            txns.extend(c.transactions)
        return txns


repo = Repository.get_instance()
