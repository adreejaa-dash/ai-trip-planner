"""
TripMind FastAPI application entry point.

Architecture overview:
  ┌─────────────────────────────────────────────────────────┐
  │  FastAPI app (main.py)                                  │
  │   ├── CORS middleware (frontend: localhost:3000)        │
  │   ├── Lifespan: DB init on startup, dispose on shutdown │
  │   ├── /health            (health router)                │
  │   └── /api/v1/itinerary  (itinerary router)            │
  └─────────────────────────────────────────────────────────┘
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from app.core.config import settings
from app.db.init_db import close_db, init_db
from app.routers import health, itinerary

# ── Logging ───────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    FastAPI lifespan context manager.
    Runs startup logic before yield, shutdown logic after.
    """
    logger.info("Starting up TripMind API…")
    await init_db()
    yield
    logger.info("Shutting down TripMind API…")
    await close_db()


# ── Application factory ───────────────────────────────────────────────────────

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "TripMind API — AI-powered travel itinerary generation. "
            "Built with FastAPI, PostgreSQL, and Google Gemini."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        default_response_class=ORJSONResponse,   # Faster JSON via orjson
        lifespan=lifespan,
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # ── Global exception handler ──────────────────────────────────────────────
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> ORJSONResponse:
        logger.exception("Unhandled exception on %s %s", request.method, request.url)
        return ORJSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": "Internal server error"},
        )

    # ── Routers ───────────────────────────────────────────────────────────────
    app.include_router(health.router)
    app.include_router(itinerary.router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
