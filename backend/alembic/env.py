"""
Alembic async migration environment.

Key differences from the default env.py:
  1. Uses asyncio.run() and AsyncEngine for async migrations
  2. Reads DATABASE_URL from .env via app.core.config (no hardcoding)
  3. Imports all models so autogenerate can detect schema changes
"""

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import settings
from app.db.base import Base

# ── Import all models for autogenerate ────────────────────────────────────────
from app.models import itinerary, user  # noqa: F401

# ── Alembic config ────────────────────────────────────────────────────────────

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


# ── Offline migrations (SQL script output) ───────────────────────────────────

def run_migrations_offline() -> None:
    """
    Run migrations without a live DB connection.
    Outputs SQL to stdout for review.
    """
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


# ── Online async migrations ────────────────────────────────────────────────────

def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations with a live async DB connection."""
    engine = create_async_engine(settings.database_url, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(do_run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
