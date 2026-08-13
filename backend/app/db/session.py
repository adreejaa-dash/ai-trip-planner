"""
Async SQLAlchemy engine and session factory.

The engine is created lazily — no network connection is made until the
first query. This means import-time and app-factory-time are always safe.

If the DB is down, get_db() raises a 503 HTTPException so the route
returns a structured error instead of a 500 traceback.
"""

from collections.abc import AsyncGenerator

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

# ── Engine (lazy — no connection made here) ───────────────────────────────────

def _make_engine():
    """Create engine with settings appropriate for the dialect."""
    is_sqlite = settings.database_url.startswith("sqlite")
    kwargs: dict = {"echo": settings.debug}
    if not is_sqlite:
        kwargs.update({"pool_pre_ping": True, "pool_size": 10, "max_overflow": 20})
    return create_async_engine(settings.database_url, **kwargs)

engine = _make_engine()

# ── Session factory ───────────────────────────────────────────────────────────

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# ── FastAPI dependency ────────────────────────────────────────────────────────

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yields an async database session.

    - Commits on success, rolls back on exception.
    - If the DB is unreachable, returns HTTP 503 Service Unavailable
      instead of letting an asyncpg ConnectionRefusedError propagate as 500.
    """
    try:
        async with AsyncSessionLocal() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()
    except HTTPException:
        raise  # Already structured — let it through
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Database is currently unavailable. "
                "Please ensure PostgreSQL is running and try again."
            ),
        ) from exc
