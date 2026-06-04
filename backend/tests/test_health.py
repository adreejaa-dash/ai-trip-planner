"""
Tests for the health check endpoints.
Demonstrates how to structure async FastAPI tests using httpx.AsyncClient.
"""

import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    """Async test client that talks directly to the ASGI app (no network)."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


@pytest.mark.anyio
async def test_health_liveness(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "uptime_seconds" in data


# Note: test_health_db requires a live PostgreSQL connection.
# Run with: pytest tests/ -v -k "not db" for CI without a DB.
