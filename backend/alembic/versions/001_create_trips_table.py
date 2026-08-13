"""create trips table

Revision ID: 001
Revises:
Create Date: 2025-08-14
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "trips",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True),
        sa.Column("destination", sa.String(255), nullable=False),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("budget", sa.Float(), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="INR"),
        sa.Column("interests", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("budget_breakdown", sa.JSON(), nullable=True),
        sa.Column("days", sa.JSON(), server_default="[]"),
        sa.Column("travel_tips", sa.JSON(), server_default="[]"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_table("trips")
