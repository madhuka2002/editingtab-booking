import uuid

import pytest
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

from app.exceptions import ConflictError, NotFoundError, RelationshipError
from app.models import PhysicalRoom, RoomType
from app.repositories import PropertyRepository
from app.schemas import PhysicalRoomCreate, PropertyCreate, RoomTypeCreate
from app.services import BookingAdminService
from conftest import ORG_A, ORG_B


def property_data(slug: str = "ocean-view") -> PropertyCreate:
    return PropertyCreate(name=" Ocean View ", slug=slug, timezone="Asia/Colombo")


def room_type_data(code: str = "DLX") -> RoomTypeCreate:
    return RoomTypeCreate(name="Deluxe", code=code, max_adults=2, max_children=1, max_occupancy=3)


@pytest.mark.asyncio
async def test_property_creation_and_normalization(session):
    prop = await BookingAdminService(session).create_property(ORG_A, property_data(" Ocean VIEW!! "))
    assert (prop.name, prop.slug, prop.organization_id) == ("Ocean View", "ocean-view", ORG_A)


@pytest.mark.asyncio
async def test_duplicate_property_slug_in_same_organization_rejected(session):
    service = BookingAdminService(session)
    await service.create_property(ORG_A, property_data())
    with pytest.raises(ConflictError):
        await service.create_property(ORG_A, property_data("OCEAN view"))


@pytest.mark.asyncio
async def test_same_slug_allowed_across_organizations_and_repository_isolation(session):
    service = BookingAdminService(session)
    await service.create_property(ORG_A, property_data())
    await service.create_property(ORG_B, property_data())
    assert len(await PropertyRepository(session).list(ORG_A)) == 1
    assert len(await PropertyRepository(session).list(ORG_B)) == 1
    assert (await service.list_properties(ORG_A))[0].organization_id == ORG_A


@pytest.mark.asyncio
async def test_tenant_cannot_get_another_organizations_property(session):
    service = BookingAdminService(session)
    prop = await service.create_property(ORG_A, property_data())
    with pytest.raises(NotFoundError):
        await service.get_property(ORG_B, prop.id)


@pytest.mark.asyncio
async def test_room_type_creation_and_duplicate_code_per_property(session):
    service = BookingAdminService(session)
    prop = await service.create_property(ORG_A, property_data())
    room_type = await service.create_room_type(ORG_A, prop.id, room_type_data(" dlx "))
    assert room_type.code == "DLX"
    with pytest.raises(ConflictError):
        await service.create_room_type(ORG_A, prop.id, room_type_data("DLX"))


@pytest.mark.asyncio
async def test_same_room_type_code_allowed_in_different_properties(session):
    service = BookingAdminService(session)
    first = await service.create_property(ORG_A, property_data("one"))
    second = await service.create_property(ORG_A, property_data("two"))
    await service.create_room_type(ORG_A, first.id, room_type_data())
    await service.create_room_type(ORG_A, second.id, room_type_data())


@pytest.mark.parametrize("values", [
    {"max_adults": -1, "max_children": 1, "max_occupancy": 1},
    {"max_adults": 2, "max_children": 1, "max_occupancy": 1},
    {"max_adults": 2, "max_children": 1, "max_occupancy": 4},
])
def test_occupancy_validation(values):
    with pytest.raises(ValidationError):
        RoomTypeCreate(name="Bad", code="BAD", **values)


@pytest.mark.asyncio
async def test_cross_organization_room_type_relationship_rejected_by_service(session):
    service = BookingAdminService(session)
    prop = await service.create_property(ORG_A, property_data())
    with pytest.raises(NotFoundError):
        await service.create_room_type(ORG_B, prop.id, room_type_data())


@pytest.mark.asyncio
async def test_physical_room_creation_duplicate_and_cross_property_rejection(session):
    service = BookingAdminService(session)
    first = await service.create_property(ORG_A, property_data("one"))
    second = await service.create_property(ORG_A, property_data("two"))
    room_type = await service.create_room_type(ORG_A, first.id, room_type_data())
    data = PhysicalRoomCreate(room_type_id=room_type.id, room_number=" 101 ", floor="1")
    room = await service.create_room(ORG_A, first.id, data)
    assert room.room_number == "101"
    with pytest.raises(ConflictError):
        await service.create_room(ORG_A, first.id, data)
    with pytest.raises(RelationshipError):
        await service.create_room(ORG_A, second.id, PhysicalRoomCreate(room_type_id=room_type.id, room_number="201"))


@pytest.mark.asyncio
async def test_cross_tenant_composite_foreign_keys_reject_invalid_rows(session):
    service = BookingAdminService(session)
    prop = await service.create_property(ORG_A, property_data())
    property_id = prop.id
    session.add(RoomType(id=uuid.uuid4(), organization_id=ORG_B, property_id=property_id, name="Invalid", code="INV", max_adults=1, max_children=0, max_occupancy=1))
    with pytest.raises(IntegrityError):
        await session.commit()
    await session.rollback()
    valid_type = await service.create_room_type(ORG_A, property_id, room_type_data())
    session.add(PhysicalRoom(organization_id=ORG_B, property_id=property_id, room_type_id=valid_type.id, room_number="X"))
    with pytest.raises(IntegrityError):
        await session.commit()
    await session.rollback()
