# Booking Setup Guide

## 1. Prerequisites

Install:

- Git
- Python 3.11+
- Node.js
- npm
- PostgreSQL

## 2. Clone

```bash
git clone https://github.com/madhuka2002/editingtab-booking.git
cd editingtab-booking
```

## 3. Backend environment

Create the project's virtual environment:

```bash
python -m venv .venv
```

Git Bash on Windows:

```bash
source .venv/Scripts/activate
```

Install:

```bash
pip install -r requirements.txt
```

## 4. PostgreSQL

Create database:

`editingtab_booking`

Configure the backend environment according to the current repository configuration.

Do not put real passwords or secrets in the repository.

## 5. Migrations

Run from the directory containing the active Alembic configuration:

```bash
python -m alembic upgrade head
```

Verify the migration state:

```bash
python -m alembic current
```

## 6. Start Booking API

The known local development environment uses:

`http://127.0.0.1:8001`

Use the current application entry point shown by the repository.

## 7. Admin Web

```bash
cd admin-web
npm install
npm run dev
```

Open:

`http://localhost:3000`

## 8. Core dependency

The Admin Web login flow uses Core authentication.

Start Core separately at:

`http://127.0.0.1:8000`

The Core repository must be configured independently.

## 9. QA browser environment

Expected local services:

```text
Core API       127.0.0.1:8000
Booking API    127.0.0.1:8001
Admin Web      localhost:3000
```

## 10. Automated validation

Backend:

```bash
python -m pytest -q
```

Frontend:

```bash
cd admin-web
npm run lint
npm run build
npx tsc --noEmit
```

## 11. Browser acceptance

QA should validate the product through the browser, not only through API documentation.

Minimum current flow:

- login
- logout
- relogin
- organization context
- property create/list/detail
- room type create/list
- physical room create/list/detail
- persistence after refresh/relogin

## 12. Development-only tenant context

The current integration uses development organization context and `X-Organization-ID`.

This must not be considered production authorization.

## 13. Troubleshooting

### Admin Web cannot log in

Check:

- Core is running
- Core URL/configuration is correct
- test account exists
- browser session/cookies are available

### Booking API cannot connect

Check:

- PostgreSQL is running
- `editingtab_booking` exists
- environment configuration is correct
- migrations have run

### Frontend dependency problems

From `admin-web`:

```bash
npm install
```

Then:

```bash
npm run lint
```

## 14. QA evidence

Record:

- Core commit/tag
- Booking commit/tag
- migration head
- browser
- OS
- Python version
- Node version
- PostgreSQL version
- screenshots for visual defects
- exact reproduction steps
