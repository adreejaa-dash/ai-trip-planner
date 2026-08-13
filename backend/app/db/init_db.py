"""
Database initialization helper.

In debug mode, creates tables automatically.
In production, run migrations with: alembic upgrade head
"""

import logging

from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine

# Import all models so Base.metadata knows about them
from app.models import itinerary  # noqa: F401

logger = logging.getLogger(__name__)


async def init_db() -> None:
    """
    Attempt to verify the database connection at startup.
    In debug mode, creates tables automatically.
    """
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
            logger.info("✓ Database connection verified.")

            from app.core.config import settings
            if settings.debug:
                await conn.run_sync(Base.metadata.create_all)
                logger.info("✓ Tables created (debug mode). Use Alembic in production.")

    except Exception as exc:
        logger.warning(
            "⚠ Database unavailable at startup (%s: %s). "
            "The API will start without a live DB connection. "
            "Run 'alembic upgrade head' and ensure PostgreSQL is running. "
            "DB-dependent endpoints will return 503 until it is reachable.",
            type(exc).__name__,
            exc,
        )


async def close_db() -> None:
    """Dispose the engine connection pool on shutdown."""
    try:
        await engine.dispose()
        logger.info("✓ Database connection pool closed.")
    except Exception as exc:
        logger.warning("⚠ Error closing DB pool: %s", exc)
