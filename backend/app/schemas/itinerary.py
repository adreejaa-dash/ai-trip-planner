"""
Pydantic v2 schemas for trip generation, retrieval, and refinement.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


# ── Request schemas ───────────────────────────────────────────────────────────

class TripGenerateRequest(BaseModel):
    destination: str = Field(..., min_length=2, max_length=255, examples=["Bhubaneswar"])
    duration: int = Field(..., ge=1, le=30, examples=[3])
    budget: float = Field(..., gt=0, examples=[10000])
    currency: str = Field(default="INR", max_length=10, examples=["INR"])
    interests: list[str] = Field(..., min_length=1, examples=[["history", "food", "culture"]])


class TripRefineRequest(BaseModel):
    instruction: str = Field(..., min_length=1, max_length=1000, examples=["Add more food experiences"])


# ── Gemini response validation schemas ────────────────────────────────────────

class GeminiActivity(BaseModel):
    time: str
    place: str
    activity: str
    description: str
    estimated_cost: float = 0

    model_config = {"extra": "ignore"}


class GeminiDayPlan(BaseModel):
    day: int
    title: str
    activities: list[GeminiActivity]

    model_config = {"extra": "ignore"}


class GeminiBudgetBreakdown(BaseModel):
    accommodation: float = 0
    food: float = 0
    transportation: float = 0
    activities: float = 0
    miscellaneous: float = 0
    total: float = 0

    model_config = {"extra": "ignore"}


class GeminiItinerary(BaseModel):
    destination: str
    summary: str
    budget_breakdown: GeminiBudgetBreakdown
    days: list[GeminiDayPlan]
    travel_tips: list[str] = Field(default_factory=list)

    model_config = {"extra": "ignore"}


# ── API response schemas ──────────────────────────────────────────────────────

class ActivityResponse(BaseModel):
    time: str
    place: str
    activity: str
    description: str
    estimated_cost: float


class DayPlanResponse(BaseModel):
    day: int
    title: str
    activities: list[ActivityResponse]


class BudgetBreakdownResponse(BaseModel):
    accommodation: float
    food: float
    transportation: float
    activities: float
    miscellaneous: float
    total: float


class TripResponse(BaseModel):
    id: str
    destination: str
    duration: int
    budget: float
    currency: str
    interests: list[str]
    summary: str | None = None
    budget_breakdown: BudgetBreakdownResponse | None = None
    days: list[DayPlanResponse] = Field(default_factory=list)
    travel_tips: list[str] = Field(default_factory=list)
    created_at: str | None = None


class TripListItem(BaseModel):
    id: str
    destination: str
    duration: int
    budget: float
    currency: str
    interests: list[str]
    summary: str | None = None
    created_at: str | None = None
