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

## ADMIN-001 browser admin

The independent Next.js admin lives in `admin-web/` and runs on port `3000`.

1. Start Platform Core on port `8000` from its separate repository:

   ```powershell
   cd backend
   .venv\Scripts\Activate.ps1
   uvicorn app.main:app --port 8000
   ```

2. Start Booking on port `8001` from this repository after configuring `BOOKING_DATABASE_URL` and explicitly applying the migration when appropriate:

   ```powershell
   uvicorn app.main:app --app-dir backend --port 8001
   ```

3. Start the admin:

   ```powershell
   cd admin-web
   Copy-Item .env.example .env.local
   npm install
   npm run dev
   ```

The admin variables are `NEXT_PUBLIC_CORE_API_URL` (default `http://127.0.0.1:8000`) and `NEXT_PUBLIC_BOOKING_API_URL` (default `http://127.0.0.1:8001`). Do not place secrets in either public variable.

Current backend limitations include missing Core organization list/detail, entitlement-read, user-management, role-management, and authenticated-organization APIs, plus missing Booking update/deactivate/delete APIs. The full contract-level analysis is in [`docs/ADMIN_UI_GAP_ANALYSIS.md`](docs/ADMIN_UI_GAP_ANALYSIS.md).
