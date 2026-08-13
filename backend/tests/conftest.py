"""
pytest conftest — shared fixtures for the TripMind test suite.

Strategy:
  - Each test gets its own in-memory SQLite database.
  - The FastAPI app's get_db dependency is overridden to use the test session.
  - generate_itinerary (the background task) is patched to a no-op so it
    doesn't try to open a second DB connection against the production engine.
"""

from __future__ import annotations

from collections.abc import AsyncGenerator
from unittest.mock import patch

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.db.base import Base
from app.db.session import get_db
from app.main import app

# Import models so Base.metadata is fully populated
from app.models import itinerary as _itin_model  # noqa: F401
from app.models import user as _user_model  # noqa: F401

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture()
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Fresh in-memory SQLite session per test."""
    engine = create_async_engine(
        TEST_DB_URL,
        echo=False,
        connect_args={"check_same_thread": False},
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )

    async with session_factory() as session:
        yield session

    await engine.dispose()


@pytest_asyncio.fixture()
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Async HTTP client with:
      - test DB session injected via dependency override
      - generate_itinerary background task patched to a no-op async mock
    """

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async def _noop_generate(*args, **kwargs):
        pass

    with patch("app.routers.itinerary.generate_itinerary", new=_noop_generate):
        transport = ASGITransport(app=app)  # type: ignore[arg-type]
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac

    app.dependency_overrides.clear()
