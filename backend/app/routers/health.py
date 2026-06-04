"""
Health check router.

GET /health  → lightweight liveness probe (no DB dependency)
GET /health/db → readiness probe (verifies DB connection)
"""

import time
from typing import Any

from fastapi import APIRouter, Depends
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
    Returns a 200 OK response confirming the API process is alive.
    Does NOT check the database — use /health/db for that.
    """
    return {
        "status": "ok",
        "app": settings.app_name,
        "version": settings.app_version,
        "uptime_seconds": round(time.time() - _START_TIME, 1),
    }


@router.get("/health/db", summary="Readiness probe (DB)")
async def health_db(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Executes a lightweight SELECT 1 query.
    Returns 200 if the DB is reachable, 503 if not (raised by dependency).
    """
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}
