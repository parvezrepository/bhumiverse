"""
Main FastAPI Application for BHUMIVerse.
AI-Assisted Land Fraud Detection & Double-Selling Risk Analysis Platform.
"""

import sys
from pathlib import Path

# Ensure both repository root and backend directory are in sys.path
_backend_dir = Path(__file__).resolve().parent.parent
_root_dir = _backend_dir.parent
for _p in [str(_root_dir), str(_backend_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.api import auth, cases, documents, analysis, admin, reports, supabase_api

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for BHUMIVerse - LandTech Innovation Hackathon 2026",
    version=settings.VERSION
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local hackathon development & preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(cases.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(supabase_api.router, prefix="/api")


@app.get("/")
def root():
    return {
        "platform": settings.APP_NAME,
        "tagline": settings.TAGLINE,
        "status": "operational",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "api_docs": "/docs",
        "demo_mode": settings.DEMO_MODE,
        "supabase_configured": settings.is_supabase_configured,
        "notice": "DEMO DATA — NOT AN OFFICIAL LAND RECORD"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "BHUMIVerse Rule-Based Fraud Detection Engine v1.0",
        "supabase_configured": settings.is_supabase_configured,
        "active_cases": 20
    }

