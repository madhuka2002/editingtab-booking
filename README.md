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