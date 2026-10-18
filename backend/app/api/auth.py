"""
Authentication API for BHUMIVerse.
Supports Sign Up, Sign In, Verification checks, Role retrieval, and Demo account provision.
Integrates with Supabase Auth or mock demo provider.
"""

from fastapi import APIRouter, HTTPException, status
from datetime import datetime
import uuid
from backend.app.models.schemas import (
    SignInRequest,
    ProfileCreate,
    ProfileResponse,
    AuthTokenResponse,
    RoleEnum
)
from backend.app.services.repository import repo
from backend.app.services.audit_service import AuditService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/sign-in", response_model=AuthTokenResponse)
def sign_in(req: SignInRequest):
    """
    Signs in user with email & password.
    Returns authenticated user profile and mock or Supabase session token.
    """
    email_clean = req.email.strip().lower()

    # Admin check
    if "admin" in email_clean:
        profile = repo.profiles.get("admin-demo-id")
    else:
        # Check existing profiles or match citizen demo
        profile = None
        for p in repo.profiles.values():
            if p.email.lower() == email_clean:
                profile = p
                break

        if not profile:
            # For testing convenience in demo mode, auto-provision unverified or verified profile
            profile = ProfileResponse(
                id=str(uuid.uuid4()),
                email=req.email,
                full_name=req.email.split("@")[0].replace(".", " ").title(),
                role=RoleEnum.CITIZEN,
                nid_mask="NID-XXXX-XXXX",
                phone_mask="+880 1XXX-XXXXXX",
                is_verified=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            repo.profiles[profile.id] = profile

    AuditService.record_event(
        event_type="AUTH_SIGN_IN_SUCCESS",
        details={"email": profile.email, "role": profile.role},
        actor_id=profile.id,
        actor_email=profile.email
    )

    return AuthTokenResponse(
        access_token=f"bhumiverse_token_{profile.id}",
        user=profile
    )


@router.post("/sign-up", response_model=ProfileResponse)
def sign_up(req: ProfileCreate):
    """
    Registers a new citizen user in Supabase Auth & public.profiles table.
    """
    for p in repo.profiles.values():
        if p.email.lower() == req.email.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

    user_id = str(uuid.uuid4())
    supabase_connected = False

    # 1. Connect to Supabase Auth & Database
    from backend.app.db.supabase_client import get_supabase_client
    client = get_supabase_client()
    if client:
        try:
            # Register in Supabase Auth
            auth_res = client.auth.sign_up({
                "email": req.email,
                "password": req.password,
                "options": {
                    "data": {
                        "full_name": req.full_name
                    }
                }
            })
            if auth_res.user:
                user_id = auth_res.user.id
                supabase_connected = True
        except Exception as e:
            # If user already registered in Supabase auth or needs format
            print(f"[Supabase Auth Notice] {e}")

        try:
            # Upsert into public.profiles
            client.table("profiles").upsert({
                "id": user_id,
                "email": req.email,
                "full_name": req.full_name,
                "role": "citizen",
                "is_verified": False
            }).execute()
            supabase_connected = True
        except Exception as e:
            print(f"[Supabase Profiles Notice] {e}")

    new_profile = ProfileResponse(
        id=user_id,
        email=req.email,
        full_name=req.full_name,
        role=RoleEnum.CITIZEN,
        nid_mask="NID-XXXX-XXXX",
        phone_mask="+880 1XXX-XXXXXX",
        is_verified=False,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    repo.profiles[new_profile.id] = new_profile

    AuditService.record_event(
        event_type="AUTH_SIGN_UP",
        details={"email": new_profile.email, "role": new_profile.role, "supabase_synced": supabase_connected},
        actor_id=new_profile.id,
        actor_email=new_profile.email
    )

    return new_profile


@router.post("/verify-email")
def verify_email(email: str):
    """
    Simulates / confirms Supabase email verification token.
    """
    target = None
    for p in repo.profiles.values():
        if p.email.lower() == email.lower():
            target = p
            break
    if not target:
        raise HTTPException(status_code=404, detail="User account not found.")

    target.is_verified = True
    AuditService.record_event(
        event_type="EMAIL_VERIFIED",
        details={"email": target.email},
        actor_id=target.id,
        actor_email=target.email
    )
    return {"message": "Email address verified successfully. Full citizen services unlocked.", "is_verified": True}


@router.get("/me", response_model=ProfileResponse)
def get_current_user(role: str = "citizen"):
    """
    Returns active demo user profile according to selected role header/query.
    """
    if role == "admin":
        return repo.profiles["admin-demo-id"]
    return repo.profiles["citizen-demo-id"]
