"""
Supabase Integration API Endpoints for BHUMIverse.
Provides health check, connection diagnostic, and database seeding utilities.
"""

from fastapi import APIRouter
from typing import Dict, Any
from backend.app.config import settings
from backend.app.db.supabase_client import test_supabase_connection, save_case_to_supabase
from backend.app.services.repository import repo

router = APIRouter(prefix="/supabase", tags=["Supabase Database"])


@router.get("/status")
def get_supabase_status() -> Dict[str, Any]:
    """
    Checks if Supabase credentials in .env are active and connected.
    """
    status = test_supabase_connection()
    masked_key = ""
    key = settings.SUPABASE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY
    if key:
        masked_key = key[:6] + "..." + key[-4:] if len(key) > 12 else "***"

    return {
        **status,
        "env_file_loaded": True,
        "configured_url": settings.SUPABASE_URL or "Not set in .env",
        "api_key_status": "Loaded" if bool(key) else "Missing in .env",
        "masked_key": masked_key,
        "instructions": (
            "To connect Supabase: Open .env file in the project, set SUPABASE_URL and SUPABASE_KEY, "
            "then run schema.sql (found in backend/supabase_schema/schema.sql) in your Supabase SQL Editor."
        )
    }


@router.post("/seed")
def seed_supabase_database() -> Dict[str, Any]:
    """
    Pushes all pre-seeded cases into the connected Supabase database.
    """
    if not settings.is_supabase_configured:
        return {
            "success": False,
            "message": "Cannot seed database: SUPABASE_URL and SUPABASE_KEY are not configured in .env"
        }

    cases = repo.get_all_cases()
    synced = 0
    failed = 0

    for c in cases:
        case_dict = c.model_dump()
        success = save_case_to_supabase(case_dict)
        if success:
            synced += 1
        else:
            failed += 1

    return {
        "success": synced > 0,
        "total_cases": len(cases),
        "synced_count": synced,
        "failed_count": failed,
        "message": f"Synchronized {synced} cases to Supabase database." if synced > 0 else "Failed to synchronize. Ensure schema.sql is executed."
    }
