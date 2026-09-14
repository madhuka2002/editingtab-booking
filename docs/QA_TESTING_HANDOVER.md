# Booking QA Testing Handover

## Release purpose

This baseline is intended for testing the implemented property/room foundation and Admin Web workflow.

It is not a complete Booking V1 release.

## Services

```text
Core API       http://127.0.0.1:8000
Booking API    http://127.0.0.1:8001
Admin Web      http://localhost:3000
```

## Current browser UAT baseline

Previously verified:

- login
- logout
- relogin
- organization creation through Core
- organization context
- property creation
- property list/detail
- room type creation
- room type list
- physical room creation
- persistence across authentication sessions

## Browser test flow

### Test 1 — Login

1. Open Admin Web.
2. Enter a valid QA account.
3. Submit login.
4. Verify dashboard loads.

Expected:

Authenticated admin UI is displayed.

### Test 2 — Organization

1. Open Organizations.
2. Verify authorized organization data.
3. Create an organization if the account has Super Admin permission.
4. Select/use the organization context.

Expected:

The selected organization is available to the browser workflow.

### Test 3 — Property

1. Open Properties.
2. Create a property.
3. Open its detail page.
4. Refresh the page.

Expected:

The property remains available.

### Test 4 — Room type

1. Open Room Types.
2. Create a room type.
3. Provide valid occupancy/code information.
4. Refresh.

Expected:

The room type is persisted and listed.

### Test 5 — Physical room

1. Open Rooms.
2. Create a physical room associated with the property/room type as required by the current UI.
3. Refresh.

Expected:

The room remains available.

### Test 6 — Session persistence

1. Logout.
2. Login again.
3. Return to the property/room pages.

Expected:

Previously saved test data remains available.

## Known limitations

Do not report the following as bugs for this baseline unless a later release explicitly claims them:

- property editing
- property activate/deactivate
- property deletion
- room-type editing
- room-type activate/deactivate
- room-type deletion
- room editing
- room activate/deactivate
- room deletion
- pricing
- availability
- booking holds
- reservations
- cancellation workflow
- public customer booking
- payment gateway
- OTA/channel manager
- social integration
- chatbot
- POS
- advanced analytics

## Critical security limitation

The current browser-to-Booking organization context is development-only.

`X-Organization-ID` is not a production authorization mechanism.

A production release must use a trusted Core-to-Booking identity contract.

## Cross-tenant testing

Where multiple organizations are available, attempt to verify that a user cannot access another organization's inventory.

Do not rely on changing a client-controlled organization header as proof of production security. The current mechanism is explicitly a development limitation.

## Defect template

```text
Title:
Severity:
Environment:
Core commit/tag:
Booking commit/tag:
Browser:
OS:
Organization:
User role:
Preconditions:
Steps:
Expected:
Actual:
Screenshots:
Console/network evidence:
Logs:
```

## Severity guidance

Critical:
Data loss, cross-tenant data exposure, authentication bypass, or inability to start the system.

High:
Major core workflow failure with no reasonable workaround.

Medium:
Important workflow issue with a workaround.

Low:
Cosmetic or minor usability issue.
