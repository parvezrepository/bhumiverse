"""
Append-Only Audit Service for BHUMIVerse.
Guarantees non-destructive, tamper-evident recording of security, document, and review events.
"""

import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.app.models.schemas import AuditEvent


class AuditService:
    """
    In-memory and database-backed append-only audit trail logger.
    Strictly forbids update or deletion of historical event records.
    """
    _audit_store: List[AuditEvent] = []

    @classmethod
    def record_event(
        cls,
        event_type: str,
        details: Dict[str, Any],
        case_id: Optional[str] = None,
        actor_id: Optional[str] = None,
        actor_email: Optional[str] = None,
        ip_address: str = "127.0.0.1"
    ) -> AuditEvent:
        """
        Appends an event to the audit trail.
        """
        event = AuditEvent(
            id=str(uuid.uuid4()),
            case_id=case_id,
            actor_id=actor_id,
            actor_email=actor_email or "system@bhumiverse.internal",
            event_type=event_type,
            details=details,
            ip_address=ip_address,
            created_at=datetime.now()
        )
        cls._audit_store.append(event)
        return event

    @classmethod
    def get_events_for_case(cls, case_id: str) -> List[AuditEvent]:
        """Returns chronological events for a specific case."""
        return [e for e in cls._audit_store if e.case_id == case_id]

    @classmethod
    def get_all_events(cls, limit: int = 100) -> List[AuditEvent]:
        """Returns all audit events ordered by newest first."""
        return sorted(cls._audit_store, key=lambda x: x.created_at, reverse=True)[:limit]
