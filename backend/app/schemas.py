import re
import uuid
from datetime import datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


def clean_required(value: str) -> str:
    value = value.strip()
    if not value:
        raise ValueError("must not be blank")
    return value


def normalized_identifier(value: str) -> str:
    value = clean_required(value).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    if not value:
        raise ValueError("must contain letters or numbers")
    return value


class PropertyCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(max_length=200)
    slug: str = Field(max_length=200)
    description: str | None = None
    address_line_1: str | None = Field(default=None, max_length=255)
    address_line_2: str | None = Field(default=None, max_length=255)
    city: str | None = Field(default=None, max_length=120)
    country_code: str | None = Field(default=None, min_length=2, max_length=2)
    timezone: str = Field(max_length=64)
    is_active: bool = True

    _name = field_validator("name")(clean_required)
    _slug = field_validator("slug")(normalized_identifier)

    @field_validator("country_code")
    @classmethod
    def normalize_country_code(cls, value: str | None) -> str | None:
        return value.strip().upper() if value else value

    @field_validator("timezone")
    @classmethod
    def valid_timezone(cls, value: str) -> str:
        value = clean_required(value)
        try:
            ZoneInfo(value)
        except ZoneInfoNotFoundError as exc:
            raise ValueError("must be a valid IANA timezone") from exc
        return value


class PropertyRead(PropertyCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    organization_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class RoomTypeCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(max_length=200)
    code: str = Field(max_length=64)
    description: str | None = None
    max_adults: int = Field(ge=0)
    max_children: int = Field(ge=0)
    max_occupancy: int = Field(ge=0)
    is_active: bool = True

    _name = field_validator("name")(clean_required)

    @field_validator("code")
    @classmethod
    def normalize_code(cls, value: str) -> str:
        return clean_required(value).upper()

    @model_validator(mode="after")
    def sensible_occupancy(self):
        if self.max_occupancy < max(self.max_adults, self.max_children):
            raise ValueError("max_occupancy cannot be below adult or child capacity")
        if self.max_occupancy > self.max_adults + self.max_children:
            raise ValueError("max_occupancy cannot exceed combined adult and child capacity")
        return self


class RoomTypeRead(RoomTypeCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    organization_id: uuid.UUID
    property_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class PhysicalRoomCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    room_type_id: uuid.UUID
    room_number: str = Field(max_length=64)
    floor: str | None = Field(default=None, max_length=64)
    is_active: bool = True

    _room_number = field_validator("room_number")(clean_required)


class PhysicalRoomRead(PhysicalRoomCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    organization_id: uuid.UUID
    property_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
