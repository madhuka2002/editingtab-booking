import uuid
from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import PhysicalRoom, Property, RoomType

ModelT = TypeVar("ModelT")


class Repository(Generic[ModelT]):
    model: type[ModelT]

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity


class PropertyRepository(Repository[Property]):
    model = Property

    async def get(self, organization_id: uuid.UUID, property_id: uuid.UUID) -> Property | None:
        return await self.session.scalar(select(Property).where(Property.organization_id == organization_id, Property.id == property_id))

    async def get_by_slug(self, organization_id: uuid.UUID, slug: str) -> Property | None:
        return await self.session.scalar(select(Property).where(Property.organization_id == organization_id, Property.slug == slug))

    async def list(self, organization_id: uuid.UUID) -> list[Property]:
        result = await self.session.scalars(select(Property).where(Property.organization_id == organization_id).order_by(Property.name, Property.id))
        return list(result)


class RoomTypeRepository(Repository[RoomType]):
    model = RoomType

    async def get(self, organization_id: uuid.UUID, property_id: uuid.UUID, room_type_id: uuid.UUID) -> RoomType | None:
        return await self.session.scalar(select(RoomType).where(RoomType.organization_id == organization_id, RoomType.property_id == property_id, RoomType.id == room_type_id))

    async def get_by_code(self, organization_id: uuid.UUID, property_id: uuid.UUID, code: str) -> RoomType | None:
        return await self.session.scalar(select(RoomType).where(RoomType.organization_id == organization_id, RoomType.property_id == property_id, RoomType.code == code))

    async def list(self, organization_id: uuid.UUID, property_id: uuid.UUID) -> list[RoomType]:
        result = await self.session.scalars(select(RoomType).where(RoomType.organization_id == organization_id, RoomType.property_id == property_id).order_by(RoomType.name, RoomType.id))
        return list(result)


class PhysicalRoomRepository(Repository[PhysicalRoom]):
    model = PhysicalRoom

    async def get_by_number(self, organization_id: uuid.UUID, property_id: uuid.UUID, room_number: str) -> PhysicalRoom | None:
        return await self.session.scalar(select(PhysicalRoom).where(PhysicalRoom.organization_id == organization_id, PhysicalRoom.property_id == property_id, PhysicalRoom.room_number == room_number))

    async def list(self, organization_id: uuid.UUID, property_id: uuid.UUID) -> list[PhysicalRoom]:
        result = await self.session.scalars(select(PhysicalRoom).where(PhysicalRoom.organization_id == organization_id, PhysicalRoom.property_id == property_id).order_by(PhysicalRoom.room_number, PhysicalRoom.id))
        return list(result)

