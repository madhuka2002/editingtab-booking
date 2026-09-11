# EditingTab Booking — Agent Instructions

## Project

This repository contains the standalone EditingTab Booking service.

Do not treat this repository as part of EditingTab Platform Core.

## Service Boundaries

Booking owns:

- Properties
- Room types
- Physical rooms
- Availability
- Pricing
- Temporary holds
- Reservations
- Booking lifecycle

Booking does not own:

- Users
- Authentication credentials
- Organizations
- Memberships
- RBAC
- Platform entitlements

Do not recreate Platform Core functionality inside Booking.

## Database Isolation

Booking uses its own PostgreSQL database.

Never query or modify Platform Core tables.

Never create database foreign keys to another service database.

External organization/user identifiers may be stored as UUID values.

## Architecture

Follow:

API
→ Service
→ Repository
→ Database

Do not implement API → database shortcuts.

Business rules belong in services.

## Tenant Isolation

Every organization-owned query must be scoped by organization_id.

Never trust organization ownership supplied only by a client request.

Authorization context must ultimately come from trusted authentication/platform integration.

## Migrations

Use Alembic.

Create one focused migration per logical schema change.

Never modify an already committed migration.

Do not automatically apply migrations unless explicitly requested.

## Tests

Every feature must include appropriate tests.

Prioritize:

- Tenant isolation
- Validation
- Duplicate prevention
- Database constraints
- Authorization boundaries
- Business rules

Run the complete test suite before reporting completion.

## Git

Do not commit or push unless explicitly requested.

Use focused changes only.

Commit prefixes:

- feat:
- fix:
- chore:
- docs:
- test:
- refactor:
- security:
- ci:

## Current Scope

Current milestone:

BOOK-001 — Property + Room Type + Physical Room Foundation.

Do not implement availability, reservations, holds, pricing calendars, OTA sync, payments, frontend, notifications, chatbot, POS, or social features unless explicitly requested.