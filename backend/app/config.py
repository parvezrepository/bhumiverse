import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Search for .env in current working dir, backend dir, or workspace root
_base_dir = Path(__file__).resolve().parent.parent
_backend_env = _base_dir / ".env"
_root_env = _base_dir.parent / ".env"

if _backend_env.exists():
    load_dotenv(dotenv_path=_backend_env)
elif _root_env.exists():
    load_dotenv(dotenv_path=_root_env)
else:
    load_dotenv()


class Settings(BaseModel):
    APP_NAME: str = "BHUMIVerse"
    TAGLINE: str = "Detect Conflicts. Investigate Risk. Protect Land Records."
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", os.getenv("SUPABASE_ANON_KEY", ""))
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "15"))
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")

    @property
    def is_supabase_configured(self) -> bool:
        url = self.SUPABASE_URL.strip()
        key = (self.SUPABASE_KEY or self.SUPABASE_SERVICE_ROLE_KEY).strip()
        # Ensure not default placeholder
        if not url or not key:
            return False
        if "your-project" in url or "placeholder" in url or "your-supabase" in key:
            return False
        return True


settings = Settings()
