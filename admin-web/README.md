# EditingTab Booking Admin

Browser admin for Platform Core authentication/administration and BOOK-001 Booking operations.

## Run

Copy `.env.example` to `.env.local`, then:

```powershell
npm install
npm run dev
```

The UI runs at `http://127.0.0.1:3000`, expects Core at port `8000`, and Booking at port `8001`. Its Next.js route handlers proxy API traffic, keep Core access/refresh tokens in HTTP-only same-site cookies, and avoid CORS-dependent browser calls.

The Booking organization selector is a local-development bridge only. Core does not expose the authenticated user's organizations, and Booking cannot yet validate Core tokens or memberships. Never treat browser-selected organization context as production authorization.

See [`../docs/ADMIN_UI_GAP_ANALYSIS.md`](../docs/ADMIN_UI_GAP_ANALYSIS.md) for blocked operations.

