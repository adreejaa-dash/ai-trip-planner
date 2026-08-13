"""
Tests for the /api/v1/itinerary endpoints.

Coverage:
  POST /api/v1/itinerary
    ✓ 202 + id + status=generating for a valid payload
    ✓ 422 validation error for missing destination
    ✓ 422 validation error for too-short destination
    ✓ 422 validation error for invalid date format
    ✓ 422 validation error for travelers out of range (too many / zero)
    ✓ 202 for minimal payload (optional fields default correctly)

  GET /api/v1/itinerary/{id}
    ✓ 404 for unknown (valid-format) UUID
    ✓ 422 for malformed UUID string
    ✓ 200 + correct data for a freshly created record
    ✓ Status is one of the known values
    ✓ days is always a list
    ✓ practical_tips is always a list
"""

from __future__ import annotations

from httpx import AsyncClient


# ── Shared payload ─────────────────────────────────────────────────────────────

VALID_PAYLOAD = {
    "destination": "Tokyo, Japan",
    "start_date": "2025-09-01",
    "end_date": "2025-09-08",
    "travelers": 2,
    "travel_styles": ["culture", "food"],
    "budget_level": "moderate",
    "pace": "balanced",
    "interests": "anime, ramen, temples",
    "dietary_restrictions": None,
    "special_requests": None,
}


# ── POST /api/v1/itinerary ─────────────────────────────────────────────────────

async def test_create_itinerary_success(client: AsyncClient):
    """Valid payload → 202 with id and status=generating."""
    response = await client.post("/api/v1/itinerary", json=VALID_PAYLOAD)
    assert response.status_code == 202, response.text

    data = response.json()
    assert "id" in data
    assert data["status"] == "generating"
    # id should be a valid UUID string (36 chars, 4 hyphens)
    assert len(data["id"]) == 36
    assert data["id"].count("-") == 4


async def test_create_itinerary_missing_destination(client: AsyncClient):
    """Omitting destination → 422."""
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "destination"}
    response = await client.post("/api/v1/itinerary", json=payload)
    assert response.status_code == 422


async def test_create_itinerary_destination_too_short(client: AsyncClient):
    """Single-char destination violates min_length=2 → 422."""
    payload = {**VALID_PAYLOAD, "destination": "A"}
    response = await client.post("/api/v1/itinerary", json=payload)
    assert response.status_code == 422


async def test_create_itinerary_invalid_date_format(client: AsyncClient):
    """Non-ISO date string → 422."""
    payload = {**VALID_PAYLOAD, "start_date": "September 1, 2025"}
    response = await client.post("/api/v1/itinerary", json=payload)
    assert response.status_code == 422


async def test_create_itinerary_travelers_too_many(client: AsyncClient):
    """travelers > 50 → 422."""
    payload = {**VALID_PAYLOAD, "travelers": 51}
    response = await client.post("/api/v1/itinerary", json=payload)
    assert response.status_code == 422


async def test_create_itinerary_travelers_zero(client: AsyncClient):
    """travelers=0 (below ge=1) → 422."""
    payload = {**VALID_PAYLOAD, "travelers": 0}
    response = await client.post("/api/v1/itinerary", json=payload)
    assert response.status_code == 422


async def test_create_itinerary_minimal_payload(client: AsyncClient):
    """Only required fields → 202 with defaults applied."""
    minimal = {
        "destination": "Paris, France",
        "start_date": "2025-10-01",
        "end_date": "2025-10-05",
    }
    response = await client.post("/api/v1/itinerary", json=minimal)
    assert response.status_code == 202
    assert "id" in response.json()


# ── GET /api/v1/itinerary/{id} ─────────────────────────────────────────────────

async def test_get_itinerary_not_found(client: AsyncClient):
    """Valid-format UUID that doesn't exist → 404."""
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = await client.get(f"/api/v1/itinerary/{fake_id}")
    assert response.status_code == 404


async def test_get_itinerary_invalid_uuid(client: AsyncClient):
    """Non-UUID path segment → 422."""
    response = await client.get("/api/v1/itinerary/not-a-uuid")
    assert response.status_code == 422


async def test_get_itinerary_returns_created_record(client: AsyncClient):
    """Round-trip: POST then GET returns the same data."""
    create_resp = await client.post("/api/v1/itinerary", json=VALID_PAYLOAD)
    assert create_resp.status_code == 202
    itinerary_id = create_resp.json()["id"]

    get_resp = await client.get(f"/api/v1/itinerary/{itinerary_id}")
    assert get_resp.status_code == 200

    data = get_resp.json()
    assert data["id"] == itinerary_id
    assert data["destination"] == VALID_PAYLOAD["destination"]
    assert data["start_date"] == VALID_PAYLOAD["start_date"]
    assert data["end_date"] == VALID_PAYLOAD["end_date"]
    assert data["travelers"] == VALID_PAYLOAD["travelers"]
    assert data["budget_level"] == VALID_PAYLOAD["budget_level"]
    assert data["pace"] == VALID_PAYLOAD["pace"]
    assert isinstance(data["travel_styles"], list)


async def test_get_itinerary_status_is_valid(client: AsyncClient):
    """Status must be one of generating | completed | failed."""
    create_resp = await client.post("/api/v1/itinerary", json=VALID_PAYLOAD)
    itinerary_id = create_resp.json()["id"]

    get_resp = await client.get(f"/api/v1/itinerary/{itinerary_id}")
    data = get_resp.json()
    assert data["status"] in {"generating", "completed", "failed"}


async def test_get_itinerary_days_is_list(client: AsyncClient):
    """days should always be a list (empty while generating)."""
    create_resp = await client.post("/api/v1/itinerary", json=VALID_PAYLOAD)
    itinerary_id = create_resp.json()["id"]

    get_resp = await client.get(f"/api/v1/itinerary/{itinerary_id}")
    assert isinstance(get_resp.json()["days"], list)


async def test_get_itinerary_practical_tips_is_list(client: AsyncClient):
    """practical_tips should always be a list."""
    create_resp = await client.post("/api/v1/itinerary", json=VALID_PAYLOAD)
    itinerary_id = create_resp.json()["id"]

    get_resp = await client.get(f"/api/v1/itinerary/{itinerary_id}")
    assert isinstance(get_resp.json()["practical_tips"], list)
