import uuid

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import ConflictError, NotFoundError, RelationshipError
from app.models import PhysicalRoom, Property, RoomType
from app.repositories import PhysicalRoomRepository, PropertyRepository, RoomTypeRepository
from app.schemas import PhysicalRoomCreate, PropertyCreate, RoomTypeCreate


class BookingAdminService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.properties = PropertyRepository(session)
        self.room_types = RoomTypeRepository(session)
        self.rooms = PhysicalRoomRepository(session)

    async def _commit(self, message: str) -> None:
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError(message) from exc

    async def create_property(self, organization_id: uuid.UUID, data: PropertyCreate) -> Property:
        if await self.properties.get_by_slug(organization_id, data.slug):
            raise ConflictError("Property slug already exists")
        entity = Property(organization_id=organization_id, **data.model_dump())
        try:
            await self.properties.add(entity)
            await self._commit("Property conflicts with existing data")
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("Property slug already exists") from exc
        return entity

    async def list_properties(self, organization_id: uuid.UUID) -> list[Property]:
        return await self.properties.list(organization_id)

    async def get_property(self, organization_id: uuid.UUID, property_id: uuid.UUID) -> Property:
        entity = await self.properties.get(organization_id, property_id)
        if entity is None:
            raise NotFoundError("Property not found")
        return entity

    async def create_room_type(self, organization_id: uuid.UUID, property_id: uuid.UUID, data: RoomTypeCreate) -> RoomType:
        await self.get_property(organization_id, property_id)
        if await self.room_types.get_by_code(organization_id, property_id, data.code):
            raise ConflictError("Room type code already exists for this property")
        entity = RoomType(organization_id=organization_id, property_id=property_id, **data.model_dump())
        try:
            await self.room_types.add(entity)
            await self._commit("Room type conflicts with existing data")
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("Room type code already exists for this property") from exc
        return entity

    async def list_room_types(self, organization_id: uuid.UUID, property_id: uuid.UUID) -> list[RoomType]:
        await self.get_property(organization_id, property_id)
        return await self.room_types.list(organization_id, property_id)

    async def create_room(self, organization_id: uuid.UUID, property_id: uuid.UUID, data: PhysicalRoomCreate) -> PhysicalRoom:
        await self.get_property(organization_id, property_id)
        room_type = await self.room_types.get(organization_id, property_id, data.room_type_id)
        if room_type is None:
            raise RelationshipError("Room type does not belong to this organization and property")
        if await self.rooms.get_by_number(organization_id, property_id, data.room_number):
            raise ConflictError("Room number already exists for this property")
        entity = PhysicalRoom(organization_id=organization_id, property_id=property_id, **data.model_dump())
        try:
            await self.rooms.add(entity)
            await self._commit("Physical room conflicts with existing data")
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("Physical room conflicts with existing data") from exc
        return entity

    async def list_rooms(self, organization_id: uuid.UUID, property_id: uuid.UUID) -> list[PhysicalRoom]:
        await self.get_property(organization_id, property_id)
        return await self.rooms.list(organization_id, property_id)

