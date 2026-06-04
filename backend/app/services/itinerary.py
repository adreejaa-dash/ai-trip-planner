"""
Itinerary service — business logic layer.

This layer sits between the router (HTTP concern) and the database (persistence concern).
No FastAPI-specific code here — pure async Python + SQLAlchemy.
When Gemini integration is added, it will be called from this layer.
"""

import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.itinerary import Itinerary
from app.schemas.itinerary import ItineraryCreate, ItineraryUpdate


class ItineraryService:
    """CRUD operations and business logic for Itinerary records."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # ── Create ────────────────────────────────────────────────────────────────

    async def create(self, payload: ItineraryCreate) -> Itinerary:
        """
        Persist a new itinerary record in 'pending' status.

        In the next sprint, this will enqueue an async Gemini generation task
        and update the record to 'complete' when done.
        """
        itinerary = Itinerary(
            destination=payload.destination.city,
            country=payload.destination.country,
            start_date=payload.start_date,
            end_date=payload.end_date,
            num_travelers=payload.num_travelers,
            budget_level=payload.preferences.budget_level,
            travel_styles=payload.preferences.styles,
            days=[],      # Populated by the AI generation step
            summary={},   # Populated by the AI generation step
            status="pending",
        )
        self.db.add(itinerary)
        await self.db.flush()  # Get the generated ID without committing
        await self.db.refresh(itinerary)
        return itinerary

    # ── Read ──────────────────────────────────────────────────────────────────

    async def get_by_id(self, itinerary_id: uuid.UUID) -> Itinerary | None:
        """Fetch a single itinerary by UUID. Returns None if not found."""
        result = await self.db.execute(
            select(Itinerary).where(Itinerary.id == itinerary_id)
        )
        return result.scalar_one_or_none()

    async def list_all(
        self,
        *,
        page: int = 1,
        per_page: int = 20,
        status: str | None = None,
    ) -> tuple[list[Itinerary], int]:
        """
        Return a paginated list of itineraries.
        Returns (items, total_count).
        """
        query = select(Itinerary).order_by(Itinerary.created_at.desc())

        if status:
            query = query.where(Itinerary.status == status)

        # Total count (without pagination)
        count_result = await self.db.execute(
            select(Itinerary.id).where(*([Itinerary.status == status] if status else []))
        )
        total = len(count_result.all())

        # Paginated results
        query = query.offset((page - 1) * per_page).limit(per_page)
        result = await self.db.execute(query)
        items = list(result.scalars().all())

        return items, total

    # ── Update ────────────────────────────────────────────────────────────────

    async def update(
        self,
        itinerary_id: uuid.UUID,
        payload: ItineraryUpdate,
    ) -> Itinerary | None:
        """
        Partially update an itinerary.
        Only sets fields that are explicitly provided (not None).
        """
        itinerary = await self.get_by_id(itinerary_id)
        if not itinerary:
            return None

        update_data = payload.model_dump(exclude_none=True)
        for field, value in update_data.items():
            setattr(itinerary, field, value)

        await self.db.flush()
        await self.db.refresh(itinerary)
        return itinerary

    # ── Delete ────────────────────────────────────────────────────────────────

    async def delete(self, itinerary_id: uuid.UUID) -> bool:
        """Delete an itinerary. Returns True if deleted, False if not found."""
        itinerary = await self.get_by_id(itinerary_id)
        if not itinerary:
            return False
        await self.db.delete(itinerary)
        return True
