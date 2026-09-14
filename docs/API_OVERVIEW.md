# Booking API Overview

Local development base URL:

`http://127.0.0.1:8001`

## Current inventory API areas

The current foundation provides property, room type and physical room operations.

The exact live endpoint list must be taken from the current FastAPI OpenAPI schema.

## Property domain

Current foundation includes:

- property creation
- property listing
- property detail

Lifecycle editing/status/deletion is future scope for this baseline.

## Room type domain

Current foundation includes:

- room type creation
- room type listing

Lifecycle editing/status/deletion is future scope for this baseline.

## Physical room domain

Current foundation includes:

- physical room creation
- room listing/detail foundation

Lifecycle editing/status/deletion is future scope for this baseline.

## Organization context

Current development integration uses organization context supplied by the Admin Web.

Important:

`X-Organization-ID` is development-only and must not be treated as production authorization.

## Future Booking API areas

Not part of the current baseline:

- pricing
- availability
- temporary holds
- reservation creation
- reservation confirmation
- cancellation
- check-in/check-out
- public booking
- OTA/channel manager integration
- payment gateway
