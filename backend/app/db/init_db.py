"""
Database initialization helper.
Called at application startup to create tables (dev) or verify connection.

In production, prefer running `alembic upgrade head` instead of
calling create_all() here.
"""

import logging

from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine

# Import all models so Base.metadata knows about them
from app.models import itinerary, user  # noqa: F401

logger = logging.getLogger(__name__)


async def init_db() -> None:
    """
    Initialize the database.
    - In DEBUG mode: auto-creates all tables from ORM metadata.
    - In all modes: verifies the connection is reachable.
    """
    try:
        async with engine.begin() as conn:
            # Verify connection
            await conn.execute(text("SELECT 1"))
            logger.info("✓ Database connection verified.")

            # Only auto-create in debug mode — use Alembic in production
            from app.core.config import settings
            if settings.debug:
                await conn.run_sync(Base.metadata.create_all)
                logger.info("✓ Tables created (debug mode).")
    except Exception as exc:
        logger.error("✗ Database initialization failed: %s", exc)
        raise


async def close_db() -> None:
    """Dispose the engine connection pool on shutdown."""
    await engine.dispose()
    logger.info("✓ Database connection pool closed.")
