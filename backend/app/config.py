from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://booking:change-me@localhost:5432/editingtab_booking"
    environment: str = "development"
    trusted_organization_header: str = "X-Organization-ID"

    model_config = SettingsConfigDict(env_file=".env", env_prefix="BOOKING_", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()

