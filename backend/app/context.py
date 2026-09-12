import uuid
from dataclasses import dataclass

from fastapi import HTTPException, Request, status

from app.config import get_settings


@dataclass(frozen=True)
class OrganizationContext:
    """Trusted tenant identity; replace this adapter when Platform Core auth is integrated."""

    organization_id: uuid.UUID


async def get_organization_context(
    request: Request,
) -> OrganizationContext:
    # Deployment must strip client-supplied values and inject this header at a trusted gateway.
    raw_organization_id = request.headers.get(get_settings().trusted_organization_header)
    if raw_organization_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing organization context")
    try:
        organization_id = uuid.UUID(raw_organization_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid organization context") from exc
    return OrganizationContext(organization_id=organization_id)
