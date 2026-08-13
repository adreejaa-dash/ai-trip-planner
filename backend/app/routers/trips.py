"""
Trip router — /api/trips

POST /api/trips/generate       → generate a new trip itinerary
GET  /api/trips                → list all saved trips
GET  /api/trips/{trip_id}      → get one complete trip
POST /api/trips/{trip_id}/refine → refine an existing trip
"""

from __future__ import annotations

import uuid
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.itinerary import Trip
from app.schemas.itinerary import (
    TripGenerateRequest,
    TripRefineRequest,
    TripResponse,
    TripListItem,
)
from app.services.gemini_service import generate_trip_itinerary, refine_trip_itinerary

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/trips", tags=["trips"])


# ── Helper to convert DB row to response ──────────────────────────────────────

def _trip_to_response(row: Trip) -> TripResponse:
    return TripResponse(
        id=str(row.id),
        destination=row.destination,
        duration=row.duration,
        budget=row.budget,
        currency=row.currency,
        interests=row.interests or [],
        summary=row.summary,
        budget_breakdown=row.budget_breakdown,
        days=row.days or [],
        travel_tips=row.travel_tips or [],
        created_at=row.created_at.isoformat() if row.created_at else None,
    )


def _trip_to_list_item(row: Trip) -> TripListItem:
    return TripListItem(
        id=str(row.id),
        destination=row.destination,
        duration=row.duration,
        budget=row.budget,
        currency=row.currency,
        interests=row.interests or [],
        summary=row.summary,
        created_at=row.created_at.isoformat() if row.created_at else None,
    )


# ── POST /api/trips/generate ─────────────────────────────────────────────────

@router.post(
    "/generate",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a new trip itinerary using Gemini AI",
)
async def generate_trip(
    body: TripGenerateRequest,
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    try:
        itinerary = await generate_trip_itinerary(
            destination=body.destination,
            duration=body.duration,
            budget=body.budget,
            currency=body.currency,
            interests=body.interests,
        )
    except RuntimeError as exc:
        # API key not set or similar config error
        logger.error("Gemini config error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is not configured. Please set GEMINI_API_KEY.",
        )
    except ValueError as exc:
        # Failed to parse Gemini response
        logger.error("Gemini response validation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to generate your itinerary right now. Please try again.",
        )
    except Exception as exc:
        logger.error("Unexpected error during generation: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate your itinerary right now. Please try again.",
        )

    # Persist to database
    trip = Trip(
        destination=body.destination,
        duration=body.duration,
        budget=body.budget,
        currency=body.currency,
        interests=body.interests,
        summary=itinerary.summary,
        budget_breakdown=itinerary.budget_breakdown.model_dump(),
        days=[d.model_dump() for d in itinerary.days],
        travel_tips=itinerary.travel_tips,
    )
    db.add(trip)
    await db.flush()
    trip_id = str(trip.id)
    await db.commit()

    logger.info("Trip %s generated and saved for %s", trip_id, body.destination)

    # Re-fetch to get created_at populated by DB
    result = await db.execute(select(Trip).where(Trip.id == trip.id))
    saved_trip = result.scalar_one()
    return _trip_to_response(saved_trip)


# ── GET /api/trips ────────────────────────────────────────────────────────────

@router.get(
    "",
    response_model=list[TripListItem],
    summary="List all saved trips",
)
async def list_trips(
    db: AsyncSession = Depends(get_db),
) -> list[TripListItem]:
    result = await db.execute(
        select(Trip).order_by(Trip.created_at.desc()).limit(50)
    )
    rows = result.scalars().all()
    return [_trip_to_list_item(row) for row in rows]


# ── GET /api/trips/{trip_id} ──────────────────────────────────────────────────

@router.get(
    "/{trip_id}",
    response_model=TripResponse,
    summary="Get a complete trip by ID",
)
async def get_trip(
    trip_id: str,
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    try:
        uid = uuid.UUID(trip_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid trip ID format.",
        )

    result = await db.execute(select(Trip).where(Trip.id == uid))
    row = result.scalar_one_or_none()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found.",
        )

    return _trip_to_response(row)


# ── POST /api/trips/{trip_id}/refine ──────────────────────────────────────────

@router.post(
    "/{trip_id}/refine",
    response_model=TripResponse,
    summary="Refine an existing trip itinerary",
)
async def refine_trip(
    trip_id: str,
    body: TripRefineRequest,
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    # Find existing trip
    try:
        uid = uuid.UUID(trip_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid trip ID format.",
        )

    result = await db.execute(select(Trip).where(Trip.id == uid))
    trip = result.scalar_one_or_none()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found.",
        )

    # Build existing itinerary dict for Gemini context
    existing_itinerary = {
        "destination": trip.destination,
        "summary": trip.summary,
        "budget_breakdown": trip.budget_breakdown,
        "days": trip.days,
        "travel_tips": trip.travel_tips,
    }

    try:
        refined = await refine_trip_itinerary(
            existing_itinerary=existing_itinerary,
            instruction=body.instruction,
            budget=trip.budget,
            currency=trip.currency,
            duration=trip.duration,
        )
    except RuntimeError as exc:
        logger.error("Gemini config error during refinement: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is not configured. Please set GEMINI_API_KEY.",
        )
    except ValueError as exc:
        logger.error("Gemini refinement response validation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to refine your itinerary right now. Please try again.",
        )
    except Exception as exc:
        logger.error("Unexpected error during refinement: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to refine your itinerary right now. Please try again.",
        )

    # Update the trip in the database
    trip.summary = refined.summary
    trip.budget_breakdown = refined.budget_breakdown.model_dump()
    trip.days = [d.model_dump() for d in refined.days]
    trip.travel_tips = refined.travel_tips

    await db.commit()

    logger.info("Trip %s refined: %r", trip_id, body.instruction[:100])

    # Re-fetch to get updated_at
    result = await db.execute(select(Trip).where(Trip.id == uid))
    updated_trip = result.scalar_one()
    return _trip_to_response(updated_trip)
