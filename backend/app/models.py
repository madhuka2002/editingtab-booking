import uuid
from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKeyConstraint, Index, Integer, String, Text, UniqueConstraint, func, text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())


class Property(TimestampMixin, Base):
    __tablename__ = "properties"
    __table_args__ = (
        UniqueConstraint("organization_id", "slug", name="uq_properties_organization_slug"),
        UniqueConstraint("organization_id", "id", name="uq_properties_organization_id_id"),
        Index("ix_properties_organization_active", "organization_id", "is_active"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    address_line_1: Mapped[str | None] = mapped_column(String(255))
    address_line_2: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str | None] = mapped_column(String(120))
    country_code: Mapped[str | None] = mapped_column(String(2))
    timezone: Mapped[str] = mapped_column(String(64), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))


class RoomType(TimestampMixin, Base):
    __tablename__ = "room_types"
    __table_args__ = (
        UniqueConstraint("property_id", "code", name="uq_room_types_property_code"),
        UniqueConstraint("organization_id", "property_id", "id", name="uq_room_types_tenant_property_id"),
        ForeignKeyConstraint(
            ["organization_id", "property_id"], ["properties.organization_id", "properties.id"],
            name="fk_room_types_tenant_property", ondelete="RESTRICT",
        ),
        CheckConstraint("max_adults >= 0", name="ck_room_types_max_adults_nonnegative"),
        CheckConstraint("max_children >= 0", name="ck_room_types_max_children_nonnegative"),
        CheckConstraint("max_occupancy >= 0", name="ck_room_types_max_occupancy_nonnegative"),
        CheckConstraint("max_occupancy >= max_adults AND max_occupancy >= max_children AND max_occupancy <= max_adults + max_children", name="ck_room_types_occupancy_capacity"),
        Index("ix_room_types_organization_property_active", "organization_id", "property_id", "is_active"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    property_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    code: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    max_adults: Mapped[int] = mapped_column(Integer, nullable=False)
    max_children: Mapped[int] = mapped_column(Integer, nullable=False)
    max_occupancy: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))


class PhysicalRoom(TimestampMixin, Base):
    __tablename__ = "physical_rooms"
    __table_args__ = (
        UniqueConstraint("property_id", "room_number", name="uq_physical_rooms_property_number"),
        ForeignKeyConstraint(
            ["organization_id", "property_id"], ["properties.organization_id", "properties.id"],
            name="fk_physical_rooms_tenant_property", ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["organization_id", "property_id", "room_type_id"],
            ["room_types.organization_id", "room_types.property_id", "room_types.id"],
            name="fk_physical_rooms_tenant_property_room_type", ondelete="RESTRICT",
        ),
        Index("ix_physical_rooms_organization_property_active", "organization_id", "property_id", "is_active"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    property_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    room_type_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    room_number: Mapped[str] = mapped_column(String(64), nullable=False)
    floor: Mapped[str | None] = mapped_column(String(64))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))

