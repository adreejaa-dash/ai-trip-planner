"""
Pydantic schemas for the Itinerary resource.

Separates request payloads (ItineraryCreate) from ORM read models (ItineraryRead)
and update payloads (ItineraryUpdate). All schemas use model_config for ORM mode.
"""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


# ── Nested schemas ─────────────────────────────────────────────────────────────

class DestinationIn(BaseModel):
    """Destination details provided by the user at planning time."""

    city: str = Field(..., min_length=1, max_length=200, examples=["Tokyo"])
    country: str = Field(..., min_length=1, max_length=200, examples=["Japan"])
    region: str | None = Field(None, examples=["Kantō"])


class TravelPreferencesIn(BaseModel):
    """User travel preferences for itinerary generation."""

    budget_level: str = Field(
        "moderate",
        pattern="^(budget|moderate|premium|luxury)$",
        description="One of: budget, moderate, premium, luxury",
    )
    styles: list[str] = Field(
        default_factory=list,
        examples=[["culture", "food", "nature"]],
    )
    accommodation: list[str] = Field(default_factory=list)
    currency: str = Field("USD", min_length=3, max_length=3)
    additional_notes: str | None = None


# ── Request schemas ────────────────────────────────────────────────────────────

class ItineraryCreate(BaseModel):
    """
    Payload to create a new itinerary generation request.
    The AI generation is async — the itinerary status starts as 'pending'.
    """

    destination: DestinationIn
    start_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", examples=["2025-03-01"])
    end_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", examples=["2025-03-08"])
    num_travelers: int = Field(1, ge=1, le=50)
    preferences: TravelPreferencesIn = Field(default_factory=TravelPreferencesIn)

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, v: str, info: Any) -> str:
        start = info.data.get("start_date")
        if start and v <= start:
            raise ValueError("end_date must be after start_date")
        return v


class ItineraryUpdate(BaseModel):
    """
    Partial update payload. All fields optional.
    Used when a user asks the AI to refine part of the itinerary.
    """

    days: list[dict[str, Any]] | None = None
    summary: dict[str, Any] | None = None
    status: str | None = Field(None, pattern="^(pending|generating|complete|failed)$")


# ── Response schemas ───────────────────────────────────────────────────────────

class ItineraryRead(BaseModel):
    """
    Full itinerary response — matches the Itinerary ORM model.
    """

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID | None
    destination: str
    country: str
    start_date: str
    end_date: str
    num_travelers: int
    budget_level: str
    travel_styles: list[str]
    days: list[dict[str, Any]]
    summary: dict[str, Any]
    status: str
    created_at: datetime
    updated_at: datetime


class ItineraryListItem(BaseModel):
    """Lightweight itinerary entry for list endpoints."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    destination: str
    country: str
    start_date: str
    end_date: str
    num_travelers: int
    status: str
    created_at: datetime
