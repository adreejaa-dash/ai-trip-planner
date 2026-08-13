"""
Tests for /api/v1/auth endpoints.

Coverage:
  POST /api/v1/auth/register
    ✓ 201 + token on valid registration
    ✓ 409 on duplicate email
    ✓ 422 on invalid email format
    ✓ 422 on password too short

  POST /api/v1/auth/login
    ✓ 200 + token on valid credentials
    ✓ 401 on wrong password
    ✓ 401 on unknown email

  GET /api/v1/auth/me
    ✓ 200 returns user info with valid token
    ✓ 401 with no token
    ✓ 401 with invalid token
"""

from __future__ import annotations

from httpx import AsyncClient

REGISTER_PAYLOAD = {
    "email": "test@example.com",
    "password": "securepassword123",
    "display_name": "Test User",
}


# ── Register ──────────────────────────────────────────────────────────────────

async def test_register_success(client: AsyncClient):
    res = await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    assert res.status_code == 201, res.text
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["email"] == REGISTER_PAYLOAD["email"]


async def test_register_duplicate_email(client: AsyncClient):
    await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    res = await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    assert res.status_code == 409


async def test_register_invalid_email(client: AsyncClient):
    payload = {**REGISTER_PAYLOAD, "email": "not-an-email"}
    res = await client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422


async def test_register_password_too_short(client: AsyncClient):
    payload = {**REGISTER_PAYLOAD, "password": "short"}
    res = await client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422


# ── Login ─────────────────────────────────────────────────────────────────────

async def test_login_success(client: AsyncClient):
    await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    res = await client.post(
        "/api/v1/auth/login",
        json={"email": REGISTER_PAYLOAD["email"], "password": REGISTER_PAYLOAD["password"]},
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert "access_token" in data
    assert data["email"] == REGISTER_PAYLOAD["email"]


async def test_login_wrong_password(client: AsyncClient):
    await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    res = await client.post(
        "/api/v1/auth/login",
        json={"email": REGISTER_PAYLOAD["email"], "password": "wrongpassword"},
    )
    assert res.status_code == 401


async def test_login_unknown_email(client: AsyncClient):
    res = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@nowhere.com", "password": "irrelevant"},
    )
    assert res.status_code == 401


# ── /me ───────────────────────────────────────────────────────────────────────

async def test_me_with_valid_token(client: AsyncClient):
    reg = await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    token = reg.json()["access_token"]

    res = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["email"] == REGISTER_PAYLOAD["email"]
    assert data["display_name"] == REGISTER_PAYLOAD["display_name"]


async def test_me_no_token(client: AsyncClient):
    res = await client.get("/api/v1/auth/me")
    assert res.status_code == 401


async def test_me_invalid_token(client: AsyncClient):
    res = await client.get("/api/v1/auth/me", headers={"Authorization": "Bearer totally.invalid.token"})
    assert res.status_code == 401
