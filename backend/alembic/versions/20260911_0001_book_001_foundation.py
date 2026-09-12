"""BOOK-001 property, room type, and physical room foundation.

Revision ID: 20260911_0001
Revises:
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260911_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "properties",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("address_line_1", sa.String(255), nullable=True),
        sa.Column("address_line_2", sa.String(255), nullable=True),
        sa.Column("city", sa.String(120), nullable=True),
        sa.Column("country_code", sa.String(2), nullable=True),
        sa.Column("timezone", sa.String(64), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "id", name="uq_properties_organization_id_id"),
        sa.UniqueConstraint("organization_id", "slug", name="uq_properties_organization_slug"),
    )
    op.create_index("ix_properties_organization_active", "properties", ["organization_id", "is_active"])
    op.create_table(
        "room_types",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("property_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("code", sa.String(64), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("max_adults", sa.Integer(), nullable=False),
        sa.Column("max_children", sa.Integer(), nullable=False),
        sa.Column("max_occupancy", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("max_adults >= 0", name="ck_room_types_max_adults_nonnegative"),
        sa.CheckConstraint("max_children >= 0", name="ck_room_types_max_children_nonnegative"),
        sa.CheckConstraint("max_occupancy >= 0", name="ck_room_types_max_occupancy_nonnegative"),
        sa.CheckConstraint("max_occupancy >= max_adults AND max_occupancy >= max_children AND max_occupancy <= max_adults + max_children", name="ck_room_types_occupancy_capacity"),
        sa.ForeignKeyConstraint(["organization_id", "property_id"], ["properties.organization_id", "properties.id"], name="fk_room_types_tenant_property", ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "property_id", "id", name="uq_room_types_tenant_property_id"),
        sa.UniqueConstraint("property_id", "code", name="uq_room_types_property_code"),
    )
    op.create_index("ix_room_types_organization_property_active", "room_types", ["organization_id", "property_id", "is_active"])
    op.create_table(
        "physical_rooms",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("property_id", sa.Uuid(), nullable=False),
        sa.Column("room_type_id", sa.Uuid(), nullable=False),
        sa.Column("room_number", sa.String(64), nullable=False),
        sa.Column("floor", sa.String(64), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["organization_id", "property_id"], ["properties.organization_id", "properties.id"], name="fk_physical_rooms_tenant_property", ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["organization_id", "property_id", "room_type_id"], ["room_types.organization_id", "room_types.property_id", "room_types.id"], name="fk_physical_rooms_tenant_property_room_type", ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("property_id", "room_number", name="uq_physical_rooms_property_number"),
    )
    op.create_index("ix_physical_rooms_organization_property_active", "physical_rooms", ["organization_id", "property_id", "is_active"])


def downgrade() -> None:
    op.drop_index("ix_physical_rooms_organization_property_active", table_name="physical_rooms")
    op.drop_table("physical_rooms")
    op.drop_index("ix_room_types_organization_property_active", table_name="room_types")
    op.drop_table("room_types")
    op.drop_index("ix_properties_organization_active", table_name="properties")
    op.drop_table("properties")

