# EditingTab Booking

Standalone Booking and Inventory service for the EditingTab Tourism Operations Platform.

## Purpose

This service owns booking-related business functionality including:

- Properties
- Room types
- Physical rooms
- Availability
- Pricing
- Temporary booking holds
- Reservations
- Manual / phone / walk-in bookings
- Booking status lifecycle

## Architecture

EditingTab Booking is independently deployable and maintains its own database.

It must not directly read or write the EditingTab Platform Core database.

Platform Core owns:

- Users
- Authentication
- Organizations
- Memberships
- RBAC
- Module entitlements

Booking owns:

- Property data
- Room types
- Physical rooms
- Availability
- Pricing
- Holds
- Reservations

Cross-service communication must use explicit APIs, events, or contracts.

## Stack

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pytest
- Docker

## Current Milestone

BOOK-001 — Property, Room Type and Physical Room foundation.

## Local backend setup

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -e ".[test]"
Copy-Item .env.example .env
uvicorn app.main:app --app-dir backend --reload
```

The service uses PostgreSQL through SQLAlchemy's async `asyncpg` driver. Run migrations explicitly with `alembic upgrade head`; application startup never applies migrations.

BOOK-001's temporary tenant adapter reads `X-Organization-ID`. This header is trusted context, not authentication: a production edge proxy must remove any client-supplied value and inject the verified Platform Core organization identifier. Request bodies contain no tenant ownership field. Replace the dependency in `app/context.py` when Platform Core integration is available.
