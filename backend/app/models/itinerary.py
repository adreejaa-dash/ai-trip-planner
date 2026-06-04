"""
Itinerary ORM model.

Represents a complete AI-generated trip itinerary stored in PostgreSQL.
The `days` field stores the full day-plan structure as JSONB for flexibility
before the schema stabilizes, with the option to normalize later.
"""

import uuid

from sqlalchemy import JSON, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class Itinerary(Base, TimestampMixin):
    """
    Top-level itinerary record.

    Columns
    -------
    id              : UUID primary key
    user_id         : FK to users table (nullable for anonymous generation)
    destination     : City name, e.g. "Tokyo"
    country         : Country name, e.g. "Japan"
    start_date      : ISO date string, e.g. "2025-03-01"
    end_date        : ISO date string, e.g. "2025-03-08"
    num_travelers   : Number of travelers
    budget_level    : budget | moderate | premium | luxury
    travel_styles   : JSON array of style tags
    days            : JSONB — full day plan array (denormalized for speed)
    summary         : JSONB — highlights, total activities, etc.
    status          : pending | generating | complete | failed
    """

    __tablename__ = "itineraries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ── Destination ────────────────────────────────────────────────────────────
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str] = mapped_column(String(255), nullable=False)
    start_date: Mapped[str] = mapped_column(String(20), nullable=False)
    end_date: Mapped[str] = mapped_column(String(20), nullable=False)
    num_travelers: Mapped[int] = mapped_column(default=1)

    # ── Preferences ────────────────────────────────────────────────────────────
    budget_level: Mapped[str] = mapped_column(String(50), default="moderate")
    travel_styles: Mapped[list] = mapped_column(JSON, default=list)

    # ── Generated content (JSONB) ─────────────────────────────────────────────
    days: Mapped[list] = mapped_column(JSON, default=list)
    summary: Mapped[dict] = mapped_column(JSON, default=dict)

    # ── Status ────────────────────────────────────────────────────────────────
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)

    # ── Relationships ─────────────────────────────────────────────────────────
    user: Mapped["User"] = relationship("User", back_populates="itineraries")  # type: ignore[name-defined]

    def __repr__(self) -> str:
        return f"<Itinerary id={self.id} destination={self.destination!r} status={self.status!r}>"
