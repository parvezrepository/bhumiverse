"""
Supabase Database Client & Synchronizer for BHUMIverse.
Connects to Supabase PostgreSQL database using URL & API Key from .env.
Falls back safely to local in-memory store if credentials are not yet configured.
"""

from typing import Optional, List, Dict, Any
import logging
from supabase import create_client, Client
from backend.app.config import settings

logger = logging.getLogger("bhumiverse.supabase")

_supabase_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """
    Returns the active Supabase client singleton, or None if not configured.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not settings.is_supabase_configured:
        logger.info("Supabase credentials not configured in .env. Running in offline/demo mode.")
        return None

    try:
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
        _supabase_client = create_client(settings.SUPABASE_URL, key)
        logger.info(f"Supabase client initialized successfully with URL: {settings.SUPABASE_URL}")
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None


def test_supabase_connection() -> Dict[str, Any]:
    """
    Tests live connection to Supabase database.
    """
    if not settings.is_supabase_configured:
        return {
            "connected": False,
            "configured": False,
            "message": "SUPABASE_URL and SUPABASE_KEY are not configured in .env",
            "url": settings.SUPABASE_URL or "Not provided"
        }

    client = get_supabase_client()
    if not client:
        return {
            "connected": False,
            "configured": True,
            "message": "Failed to create Supabase client instance.",
            "url": settings.SUPABASE_URL
        }

    try:
        # Perform lightweight query to check connection
        res = client.table("cases").select("id", count="exact").limit(1).execute()
        return {
            "connected": True,
            "configured": True,
            "message": "Successfully connected to Supabase PostgreSQL database!",
            "url": settings.SUPABASE_URL,
            "total_cases_in_db": res.count if hasattr(res, "count") else len(res.data)
        }
    except Exception as e:
        # Table might not exist yet if schema.sql has not been run
        err_msg = str(e)
        if "relation \"public.cases\" does not exist" in err_msg or "PGRST204" in err_msg or "PGRST205" in err_msg or "schema cache" in err_msg or "404" in err_msg:
            return {
                "connected": True,
                "configured": True,
                "schema_ready": False,
                "message": "Connected to Supabase live project successfully! The database is ready. Run backend/supabase_schema/schema.sql in your Supabase SQL Editor to create tables.",
                "url": settings.SUPABASE_URL
            }
        return {
            "connected": False,
            "configured": True,
            "message": f"Connection error: {err_msg}",
            "url": settings.SUPABASE_URL
        }


def save_case_to_supabase(case_dict: Dict[str, Any]) -> bool:
    """
    Inserts or updates a case record in the Supabase 'cases' table.
    """
    client = get_supabase_client()
    if not client:
        return False

    try:
        payload = {
            "id": case_dict.get("id"),
            "tracking_id": case_dict.get("tracking_id"),
            "title": case_dict.get("title"),
            "district": case_dict.get("district"),
            "upazila": case_dict.get("upazila"),
            "mouza": case_dict.get("mouza"),
            "plot_khatian_summary": case_dict.get("plot_khatian_summary"),
            "status": case_dict.get("status", "submitted"),
            "risk_level": case_dict.get("risk_level", "insufficient_data"),
            "is_demo": case_dict.get("is_demo", False),
        }
        client.table("cases").upsert(payload).execute()
        return True
    except Exception as e:
        logger.warning(f"Could not sync case to Supabase: {e}")
        return False


def save_audit_log_to_supabase(log_dict: Dict[str, Any]) -> bool:
    """
    Appends an immutable audit event to the Supabase 'audit_logs' table.
    """
    client = get_supabase_client()
    if not client:
        return False

    try:
        payload = {
            "id": log_dict.get("id"),
            "case_id": log_dict.get("case_id"),
            "event_type": log_dict.get("event_type"),
            "actor_email": log_dict.get("actor_email"),
            "details": log_dict.get("details", {}),
            "ip_address": log_dict.get("ip_address"),
            "user_agent": log_dict.get("user_agent")
        }
        client.table("audit_logs").insert(payload).execute()
        return True
    except Exception as e:
        logger.warning(f"Could not sync audit log to Supabase: {e}")
        return False
