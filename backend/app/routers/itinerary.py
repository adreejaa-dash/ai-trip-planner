"""
Itinerary router — /api/v1/itinerary

All endpoints delegate business logic to ItineraryService.
The router only handles HTTP: parsing input, calling service, returning output.
"""

import math
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.common import APIResponse, PaginatedMeta
from app.schemas.itinerary import (
    ItineraryCreate,
    ItineraryListItem,
    ItineraryRead,
    ItineraryUpdate,
)
from app.services.itinerary import ItineraryService

router = APIRouter(prefix="/itinerary", tags=["itinerary"])


# ── Helpers ────────────────────────────────────────────────────────────────────

def get_service(db: AsyncSession = Depends(get_db)) -> ItineraryService:
    return ItineraryService(db)


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=ItineraryRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new itinerary",
    description=(
        "Accepts trip preferences and creates a new itinerary record with status='pending'. "
        "AI generation will be triggered asynchronously in a future sprint."
    ),
)
async def create_itinerary(
    payload: ItineraryCreate,
    service: ItineraryService = Depends(get_service),
) -> Any:
    itinerary = await service.create(payload)
    return itinerary


@router.get(
    "",
    summary="List itineraries",
    description="Returns a paginated list of itineraries, optionally filtered by status.",
)
async def list_itineraries(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    status_filter: str | None = Query(None, alias="status", description="Filter by status"),
    service: ItineraryService = Depends(get_service),
) -> dict[str, Any]:
    items, total = await service.list_all(
        page=page,
        per_page=per_page,
        status=status_filter,
    )
    return {
        "items": [ItineraryListItem.model_validate(i) for i in items],
        "meta": PaginatedMeta(
            total=total,
            page=page,
            per_page=per_page,
            pages=math.ceil(total / per_page) if total else 0,
        ),
    }


@router.get(
    "/{itinerary_id}",
    response_model=ItineraryRead,
    summary="Get itinerary by ID",
)
async def get_itinerary(
    itinerary_id: uuid.UUID,
    service: ItineraryService = Depends(get_service),
) -> Any:
    itinerary = await service.get_by_id(itinerary_id)
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary {itinerary_id} not found.",
        )
    return itinerary


@router.patch(
    "/{itinerary_id}",
    response_model=ItineraryRead,
    summary="Update an itinerary",
    description="Partially update itinerary fields (days, summary, status).",
)
async def update_itinerary(
    itinerary_id: uuid.UUID,
    payload: ItineraryUpdate,
    service: ItineraryService = Depends(get_service),
) -> Any:
    itinerary = await service.update(itinerary_id, payload)
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary {itinerary_id} not found.",
        )
    return itinerary


@router.delete(
    "/{itinerary_id}",
    response_model=APIResponse,
    summary="Delete an itinerary",
)
async def delete_itinerary(
    itinerary_id: uuid.UUID,
    service: ItineraryService = Depends(get_service),
) -> Any:
    deleted = await service.delete(itinerary_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary {itinerary_id} not found.",
        )
    return APIResponse(message=f"Itinerary {itinerary_id} deleted.")
