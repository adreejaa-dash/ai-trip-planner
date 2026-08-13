"""
Core configuration — loads all settings from environment variables.
Uses pydantic-settings for type-safe, validated config.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Application ───────────────────────────────────────────────────────────
    debug: bool = False
    app_name: str = "TripPlanner API"
    app_version: str = "1.0.0"

    # ── Database ──────────────────────────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/tripplanner"

    # ── CORS ──────────────────────────────────────────────────────────────────
    frontend_origin: str = "http://localhost:3000"

    # ── AI ────────────────────────────────────────────────────────────────────
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [self.frontend_origin]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
