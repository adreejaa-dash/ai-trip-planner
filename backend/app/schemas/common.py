"""
Shared Pydantic schema types used across multiple routers.
"""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class APIResponse(BaseModel):
    """Generic success envelope."""

    success: bool = True
    message: str = "OK"
    data: Any = None


class PaginatedMeta(BaseModel):
    """Pagination metadata."""

    total: int
    page: int
    per_page: int
    pages: int


class ErrorDetail(BaseModel):
    """Structured error response body."""

    success: bool = False
    error: str
    detail: str | None = None
