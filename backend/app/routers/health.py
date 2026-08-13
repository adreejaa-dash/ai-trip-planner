"""
Health check router.

GET /health    → liveness probe (no DB dependency — always 200)
GET /health/db → readiness probe (checks DB, returns 503 if down)
"""

import time
from typing import Any

from fastapi import APIRouter, Depends, status
from fastapi.responses import ORJSONResponse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.db.session import get_db

router = APIRouter(tags=["health"])

_START_TIME = time.time()


@router.get("/health", summary="Liveness probe")
async def health_check(
    settings: Settings = Depends(get_settings),
) -> dict[str, Any]:
    """
    Always returns 200 — confirms the API process is alive.
    Does NOT touch the database.
    """
    return {
        "status": "ok",
        "app": settings.app_name,
        "version": settings.app_version,
        "uptime_seconds": round(time.time() - _START_TIME, 1),
    }


@router.get("/health/db", summary="Readiness probe (database)")
async def health_db(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    """
    Returns 200 if PostgreSQL is reachable, 503 if not.
    The 503 is raised automatically by get_db() when the connection fails.
    """
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}
