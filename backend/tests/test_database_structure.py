from sqlalchemy import CheckConstraint, ForeignKeyConstraint

from app.models import PhysicalRoom, Property, RoomType


def names(items):
    return {item.name for item in items}


def test_unique_and_occupancy_constraints_exist():
    assert "uq_properties_organization_slug" in names(Property.__table__.constraints)
    assert "uq_room_types_property_code" in names(RoomType.__table__.constraints)
    assert "uq_physical_rooms_property_number" in names(PhysicalRoom.__table__.constraints)
    checks = {item.name for item in RoomType.__table__.constraints if isinstance(item, CheckConstraint)}
    assert checks == {"ck_room_types_max_adults_nonnegative", "ck_room_types_max_children_nonnegative", "ck_room_types_max_occupancy_nonnegative", "ck_room_types_occupancy_capacity"}


def test_composite_tenant_foreign_keys_and_restrict_delete_exist():
    room_type_fks = [item for item in RoomType.__table__.constraints if isinstance(item, ForeignKeyConstraint)]
    room_fks = [item for item in PhysicalRoom.__table__.constraints if isinstance(item, ForeignKeyConstraint)]
    assert {(fk.name, tuple(fk.column_keys), fk.ondelete) for fk in room_type_fks} == {("fk_room_types_tenant_property", ("organization_id", "property_id"), "RESTRICT")}
    assert {(fk.name, tuple(fk.column_keys), fk.ondelete) for fk in room_fks} == {
        ("fk_physical_rooms_tenant_property", ("organization_id", "property_id"), "RESTRICT"),
        ("fk_physical_rooms_tenant_property_room_type", ("organization_id", "property_id", "room_type_id"), "RESTRICT"),
    }


def test_organization_id_is_external_not_foreign_keyed():
    assert not Property.__table__.foreign_keys
    assert {column.target_fullname for column in RoomType.__table__.foreign_keys} <= {"properties.organization_id", "properties.id"}

