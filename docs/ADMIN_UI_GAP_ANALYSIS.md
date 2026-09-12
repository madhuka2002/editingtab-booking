# ADMIN-001 Backend Gap Analysis

Verified against the local Platform Core and Booking source on 2026-09-12. Endpoint names below are required contracts, not implemented routes.

| Missing operation | Required frontend behavior | Required backend endpoint | Owner | Security requirement | Priority |
|---|---|---|---|---|---|
| List organizations | Searchable organization table with active and Booking status | `GET /api/v1/organizations` | Platform Core | Super Admin only; pagination and safe filtering | P0 |
| View organization | Durable organization detail view | `GET /api/v1/organizations/{organization_id}` | Platform Core | Super Admin only | P0 |
| Read Booking entitlement | Show verified enabled/disabled status | `GET /api/v1/organizations/{organization_id}/entitlements/booking` | Platform Core | Super Admin or explicitly entitled org admin | P0 |
| Resolve current memberships | Select only organizations available to the signed-in user | `GET /api/v1/auth/me/organizations` | Platform Core | Return active memberships only; tenant scoped | P0 |
| Trusted Core→Booking identity | Remove browser-selected `X-Organization-ID` bridge | Booking token validation or trusted gateway contract | Platform Core + Booking | Signed identity, membership, permission, entitlement, replay/expiry checks | P0 |
| List organization users | Organization-level users table | `GET /api/v1/organizations/{organization_id}/users` | Platform Core | Tenant membership plus user-read permission | P0 |
| Create/invite user | Validated create or invitation form | `POST /api/v1/organizations/{organization_id}/users` | Platform Core | Tenant admin permission; audit event; no password leakage | P0 |
| Update/deactivate user | Edit profile/status with confirmation | `PATCH /api/v1/organizations/{organization_id}/users/{user_id}` | Platform Core | Tenant admin permission; prevent unsafe self/last-admin removal | P1 |
| Assign user roles | Role assignment control | `PUT /api/v1/organizations/{organization_id}/users/{user_id}/roles` | Platform Core | Tenant admin permission; organization-consistent role IDs; audit | P0 |
| List roles/permissions | Role and permission tables | `GET /api/v1/organizations/{organization_id}/roles`, `GET /api/v1/permissions` | Platform Core | Tenant membership; expose only assignable permissions | P0 |
| Create role | Role form | `POST /api/v1/organizations/{organization_id}/roles` | Platform Core | Role-manage permission; normalized unique slug; audit | P1 |
| Edit role | Edit form with concurrency handling | `PATCH /api/v1/organizations/{organization_id}/roles/{role_id}` | Platform Core | Role-manage permission; protect system roles; audit | P1 |
| Delete role | Confirmation with dependency warning | `DELETE /api/v1/organizations/{organization_id}/roles/{role_id}` | Platform Core | Role-manage permission; protect system/in-use roles; audit | P1 |
| Assign permissions | Permission checklist | `PUT /api/v1/organizations/{organization_id}/roles/{role_id}/permissions` | Platform Core | Role-manage permission; allow-list permission codes; audit | P1 |
| Update property | Edit property information | `PATCH /api/v1/properties/{property_id}` | Booking | Trusted tenant context; property-manage permission; tenant-scoped update | P1 |
| Deactivate property | Status control with confirmation | `PATCH /api/v1/properties/{property_id}/status` | Booking | Trusted tenant context; permission; validate dependent operations | P1 |
| Update/deactivate room type | Edit/status controls | `PATCH /api/v1/properties/{property_id}/room-types/{room_type_id}` | Booking | Trusted tenant context; property relationship and permission checks | P1 |
| Update/deactivate physical room | Edit/status controls | `PATCH /api/v1/properties/{property_id}/rooms/{room_id}` | Booking | Trusted tenant context; property/room-type consistency and permission checks | P1 |
| Soft delete | Reversible delete controls if lifecycle requires them | Explicit resource-specific `DELETE`/restore contracts | Owning service | Tenant scoped, authorized, audited, dependency-safe | P2 |
| Hard delete | Destructive confirmation and dependency display | Explicit admin purge endpoints, if policy permits | Owning service | Super Admin or narrowly privileged; retention/legal checks; audit | P3 |

Existing usable APIs are Core `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`, Super-Admin `POST /api/v1/organizations`, and Booking's BOOK-001 property/room-type/physical-room create/list/detail endpoints.

