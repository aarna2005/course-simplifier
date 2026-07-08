"""
main.py
-------
FastAPI application entry point.

Starts the app, registers CORS middleware, mounts all routers,
and exposes a /health check endpoint.

Run with:
  uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import upload, simplify

# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------

app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description=(
        "AI-powered Course Content Simplification Agent "
        "using IBM watsonx.ai Studio Foundation Models."
    ),
)

# ---------------------------------------------------------------------------
# CORS – allow the React dev server to reach the API
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(upload.router)
app.include_router(simplify.router)

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Simple liveness probe.
    Returns the app name, version, and configured model ID.
    """
    return {
        "status": "ok",
        "app": settings.app_title,
        "version": settings.app_version,
        "model": settings.watsonx_model_id,
    }
