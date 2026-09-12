import uuid

import pytest

from conftest import ORG_A, ORG_B


def headers(org=ORG_A):
    return {"X-Organization-ID": str(org)}


@pytest.mark.asyncio
async def test_property_api_success_duplicate_and_tenant_isolation(client, property_payload):
    created = await client.post("/api/v1/properties", json=property_payload, headers=headers())
    assert created.status_code == 201
    property_id = created.json()["id"]
    assert (await client.post("/api/v1/properties", json=property_payload, headers=headers())).status_code == 409
    assert (await client.get(f"/api/v1/properties/{property_id}", headers=headers())).status_code == 200
    assert (await client.get(f"/api/v1/properties/{property_id}", headers=headers(ORG_B))).status_code == 404
    assert (await client.get("/api/v1/properties", headers=headers(ORG_B))).json() == []


@pytest.mark.asyncio
async def test_room_type_and_room_api_success_and_failures(client, property_payload, room_type_payload):
    prop = (await client.post("/api/v1/properties", json=property_payload, headers=headers())).json()
    room_type_response = await client.post(f"/api/v1/properties/{prop['id']}/room-types", json=room_type_payload, headers=headers())
    assert room_type_response.status_code == 201
    room_type = room_type_response.json()
    assert len((await client.get(f"/api/v1/properties/{prop['id']}/room-types", headers=headers())).json()) == 1
    room_payload = {"room_type_id": room_type["id"], "room_number": "101", "floor": "1"}
    assert (await client.post(f"/api/v1/properties/{prop['id']}/rooms", json=room_payload, headers=headers())).status_code == 201
    assert len((await client.get(f"/api/v1/properties/{prop['id']}/rooms", headers=headers())).json()) == 1
    assert (await client.post(f"/api/v1/properties/{prop['id']}/rooms", json=room_payload, headers=headers())).status_code == 409
    invalid = dict(room_type_payload, max_occupancy=99)
    assert (await client.post(f"/api/v1/properties/{prop['id']}/room-types", json=invalid, headers=headers())).status_code == 422


@pytest.mark.asyncio
async def test_api_requires_valid_explicit_organization_context(client, property_payload):
    assert (await client.post("/api/v1/properties", json=property_payload)).status_code == 400
    assert (await client.post("/api/v1/properties", json=property_payload, headers={"X-Organization-ID": "not-a-uuid"})).status_code == 400
    malicious = dict(property_payload, organization_id=str(uuid.uuid4()))
    response = await client.post("/api/v1/properties", json=malicious, headers=headers())
    assert response.status_code == 422
