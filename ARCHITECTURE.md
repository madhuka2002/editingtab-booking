# EditingTab Booking Architecture

## Service Boundary

EditingTab Booking is a standalone service.

It has its own:

- Source code
- PostgreSQL database
- Migrations
- Tests
- Environment configuration
- Deployment
- Documentation

## Data Ownership

### Booking owns

- Properties
- Room types
- Physical rooms
- Availability
- Pricing
- Temporary holds
- Reservations
- Booking status
- Booking guest information
- Manual bookings

### Booking does not own

- User accounts
- Authentication credentials
- Organizations
- Organization memberships
- Roles
- Permissions
- Platform module entitlements

These belong to EditingTab Platform Core.

## Database Rule

Booking must never directly connect to or query Platform Core's database.

Organization and user identifiers received from trusted platform contracts may be stored as external UUID references without database foreign keys to Core.

Example:

organization_id UUID NOT NULL

This identifies the Core organization that owns Booking data, but it is not a cross-database foreign key.

## Application Layers

API
↓
Service
↓
Repository
↓
Database

Business logic belongs in services.

Repositories handle persistence.

API handlers must not contain direct database business logic.

## Tenant Isolation

All organization-owned Booking records must be scoped by organization_id.

Queries must never return records belonging to another organization.

Tenant isolation must be enforced server-side.

## BOOK-001 Scope

BOOK-001 implements:

- Property model
- Room Type model
- Physical Room model
- Repositories
- Services
- Schemas
- API endpoints
- Alembic migration
- Tests
- Tenant isolation

BOOK-001 does not implement:

- Availability
- Pricing calendars
- Reservations
- Booking holds
- Customer booking UI
- OTA synchronization
- Payments
- Notifications
- Social Inbox
- AI chatbot
- POS