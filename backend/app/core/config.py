"""
Core configuration — loads all settings from environment variables.
Uses pydantic-settings for type-safe, validated config.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Application ───────────────────────────────────────────────────────────
    debug: bool = False
    secret_key: str = "change-me"
    app_name: str = "TripMind API"
    app_version: str = "0.1.0"

    # ── API ───────────────────────────────────────────────────────────────────
    api_v1_prefix: str = "/api/v1"

    # ── Database ──────────────────────────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/tripmind"

    # ── CORS ──────────────────────────────────────────────────────────────────
    frontend_origin: str = "http://localhost:3000"

    # ── AI (future) ───────────────────────────────────────────────────────────
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-pro"

    # ── Vector DB ─────────────────────────────────────────────────────────────
    chroma_persist_dir: str = "./chroma_data"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        """Return allowed CORS origins as a list."""
        return [self.frontend_origin]


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings singleton.
    Use as a FastAPI dependency: settings = Depends(get_settings)
    """
    return Settings()


# Module-level shortcut for non-DI usage
settings = get_settings()
