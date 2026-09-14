# Booking Architecture Status

## Boundary

Booking owns tourism inventory and booking-domain state.

```text
Admin Web
    |
    v
Booking API
    |
 Service
    |
Repository
    |
PostgreSQL
```

Core is a separate service:

```text
Admin Web
    |
    +----> Core API
    |
    +----> Booking API
```

## Booking-owned data

Current/future Booking domain includes:

- properties
- room types
- physical rooms
- pricing
- availability
- holds
- reservations
- booking lifecycle

## Core-owned data

Core owns:

- users
- organizations
- memberships
- authentication
- roles
- permissions
- module entitlements

## Modularity rule

Booking must not read Core's internal database.

Core must not read Booking's internal database.

Cross-module communication must happen through explicit APIs/events/connectors.

## Current development limitation

The Admin Web currently passes development organization context using `X-Organization-ID` where required.

This is not a production trust boundary.

A future production identity contract must establish:

- authenticated service identity
- organization identity
- user identity where needed
- entitlement checks
- authorization semantics
- token validation
- failure behavior

## Current implementation

`BOOK-001` established property/room inventory foundation.

`ADMIN-001` established browser Admin Web foundation and Core authentication proxy integration.

## Next major booking work

- complete property/room/room-type lifecycle CRUD
- pricing
- availability
- temporary holds
- reservation lifecycle
- public booking flow
- production identity integration
- automated and browser regression coverage
