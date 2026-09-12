import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.context import OrganizationContext, get_organization_context
from app.database import get_session
from app.schemas import PhysicalRoomCreate, PhysicalRoomRead, PropertyCreate, PropertyRead, RoomTypeCreate, RoomTypeRead
from app.services import BookingAdminService

router = APIRouter(prefix="/api/v1")
Session = Annotated[AsyncSession, Depends(get_session)]
Context = Annotated[OrganizationContext, Depends(get_organization_context)]


@router.post("/properties", response_model=PropertyRead, status_code=status.HTTP_201_CREATED)
async def create_property(data: PropertyCreate, session: Session, context: Context):
    return await BookingAdminService(session).create_property(context.organization_id, data)


@router.get("/properties", response_model=list[PropertyRead])
async def list_properties(session: Session, context: Context):
    return await BookingAdminService(session).list_properties(context.organization_id)


@router.get("/properties/{property_id}", response_model=PropertyRead)
async def get_property(property_id: uuid.UUID, session: Session, context: Context):
    return await BookingAdminService(session).get_property(context.organization_id, property_id)


@router.post("/properties/{property_id}/room-types", response_model=RoomTypeRead, status_code=status.HTTP_201_CREATED)
async def create_room_type(property_id: uuid.UUID, data: RoomTypeCreate, session: Session, context: Context):
    return await BookingAdminService(session).create_room_type(context.organization_id, property_id, data)


@router.get("/properties/{property_id}/room-types", response_model=list[RoomTypeRead])
async def list_room_types(property_id: uuid.UUID, session: Session, context: Context):
    return await BookingAdminService(session).list_room_types(context.organization_id, property_id)


@router.post("/properties/{property_id}/rooms", response_model=PhysicalRoomRead, status_code=status.HTTP_201_CREATED)
async def create_room(property_id: uuid.UUID, data: PhysicalRoomCreate, session: Session, context: Context):
    return await BookingAdminService(session).create_room(context.organization_id, property_id, data)


@router.get("/properties/{property_id}/rooms", response_model=list[PhysicalRoomRead])
async def list_rooms(property_id: uuid.UUID, session: Session, context: Context):
    return await BookingAdminService(session).list_rooms(context.organization_id, property_id)

