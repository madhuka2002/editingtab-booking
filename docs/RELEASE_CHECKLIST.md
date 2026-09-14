# Booking Release Checklist

## Source

- [ ] Exact Booking commit identified
- [ ] Exact Core commit identified
- [ ] QA tag/release created
- [ ] Release notes updated

## Environment

- [ ] Python version recorded
- [ ] Node version recorded
- [ ] PostgreSQL version recorded
- [ ] Required environment variables documented
- [ ] No secrets committed

## Database

- [ ] `editingtab_booking` exists
- [ ] Alembic upgrade succeeds
- [ ] Alembic head recorded
- [ ] Test database is isolated from development data

## Backend

- [ ] Backend tests pass
- [ ] `git diff --check` passes
- [ ] Tenant-scoped queries tested

## Admin Web

- [ ] npm install succeeds
- [ ] lint passes
- [ ] TypeScript check passes
- [ ] production build passes
- [ ] browser login passes
- [ ] browser CRUD flows claimed by the release pass

## Security

- [ ] No passwords/API keys in repository
- [ ] Development `X-Organization-ID` warning remains visible until replaced
- [ ] Cross-tenant access tested
- [ ] Production service identity is not falsely represented as complete

## QA

- [ ] QA handover updated
- [ ] Known limitations updated
- [ ] Browser test environment documented
- [ ] Defect template available
