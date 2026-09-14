# EditingTab Booking

Booking and inventory module for the Editing Tab modular tourism operations platform.

## Purpose

The Booking module owns accommodation inventory and booking-domain data while remaining independently deployable from Core and other optional modules.

Current foundation includes:

- Properties
- Room types
- Physical rooms
- Organization-scoped inventory
- Browser-based Admin Web foundation
- Core authentication proxy integration
- Organization context for current development environment

## Current implementation status

Completed milestones:

- `BOOK-001` — property and room foundation
- `ADMIN-001` — browser Admin Web foundation

Current Admin Web routes include:

- `/login`
- `/dashboard`
- `/organizations`
- `/properties`
- `/properties/[propertyId]`
- `/room-types`
- `/rooms`
- `/users`
- `/roles`

The browser UAT baseline has verified:

- browser login/logout/relogin
- Core organization creation
- organization context
- property creation/list/detail
- room type creation/list
- physical room creation
- data persistence across authentication sessions

## Important current limitation

The current development integration uses a manually selected organization context and a development-only `X-Organization-ID` header.

This is **not production authorization**.

A trusted Core-to-Booking identity contract must replace this development mechanism before production deployment.

## Current scope

Implemented foundation:

- property CRUD foundation for create/read
- room-type create/read foundation
- physical-room create/read foundation
- organization-scoped queries
- Admin Web navigation and forms
- server-side Core auth proxy/session handling

Not yet implemented in this baseline:

- property edit/status/delete
- room-type edit/status/delete
- room edit/status/delete
- pricing
- availability engine
- temporary holds
- reservation lifecycle
- public customer booking flow
- payment gateway
- OTA/channel manager integrations
- advanced booking analytics
- production service-to-service identity

## Technology

Backend:

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic

Frontend:

- Next.js
- React
- TypeScript

## Setup

### Prerequisites

Install:

- Git
- Python 3.11+
- Node.js and npm
- PostgreSQL

### Clone

```bash
git clone https://github.com/madhuka2002/editingtab-booking.git
cd editingtab-booking
```

### Backend environment

```bash
python -m venv .venv
source .venv/Scripts/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

If the repository's current dependency file is located elsewhere, follow the repository tree and current tooling.

### Database

Create:

`editingtab_booking`

Configure the backend `.env` using the fields expected by the current configuration.

Do not commit `.env` or credentials.

### Run migrations

Use the repository's current Alembic configuration from the backend working directory.

```bash
python -m alembic upgrade head
```

### Start backend

Use the repository's current FastAPI application entry point and configured development port. The known local development setup has used:

`http://127.0.0.1:8001`

### Admin Web

```bash
cd admin-web
npm install
npm run dev
```

Known local development URL:

`http://localhost:3000`

The frontend proxies authenticated Core/Booking requests server-side where implemented.

## Test

Backend:

```bash
python -m pytest -q
```

Admin Web:

```bash
npm run lint
npm run build
```

TypeScript:

```bash
npx tsc --noEmit
```

Run the commands supported by the current checkout; test counts may change.

## Browser QA

Use a real browser for product acceptance.

Recommended local services:

```text
Core API       http://127.0.0.1:8000
Booking API    http://127.0.0.1:8001
Admin Web      http://localhost:3000
```

Recommended flow:

1. Open Admin Web.
2. Login with a valid test account.
3. Verify organization context.
4. Create/select an organization as permitted.
5. Create a property.
6. Open property detail.
7. Create a room type.
8. Create a physical room.
9. Refresh/re-login.
10. Confirm persisted data.
11. Verify unauthorized/cross-tenant scenarios where test data is available.

## Security warning

Never treat `X-Organization-ID` as a trusted production identity mechanism.

Never commit:

- `.env`
- database passwords
- JWT secrets
- API keys
- customer data

## QA documentation

See:

- `docs/SETUP.md`
- `docs/QA_TESTING_HANDOVER.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/ARCHITECTURE_STATUS.md`
- `docs/API_OVERVIEW.md`
- `docs/CURRENT_STATUS.md`
