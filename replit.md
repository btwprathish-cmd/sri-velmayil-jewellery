# Sri Velmayil Jewellery

A gold/silver rate tracking + jewellery collections site for a Tirupur, Tamil Nadu jewellery shop. Displays live 22K/24K gold rates, silver prices, historical rate charts, jewellery collections with live price estimates, a blog, and a contact form.

## Run & Operate

- `pnpm --filter @workspace/sabarish run dev` — run the Vite frontend (auto-assigned PORT)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000/8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (optional - not used currently)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React 19 + wouter (routing) + TanStack Query
- API: Express 5 + cookie-parser + pino logging
- DB: PostgreSQL + Drizzle ORM (schema defined, not yet in use)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API)
- Fonts: Playfair Display (serif) + Inter (sans) via Google Fonts

## Where things live

- `artifacts/sabarish/src/pages/` — all page components (14 pages)
- `artifacts/sabarish/src/components/` — Navbar, Footer, RateCalculator, etc.
- `artifacts/sabarish/src/utils/` — date, brand, rates, auth helpers
- `artifacts/sabarish/src/data/` — collections.json, blog-posts.json, rate-history.json
- `artifacts/api-server/src/routes/` — health.ts, rates.ts, auth.ts
- `artifacts/api-server/src/lib/` — rates.ts (JSON reader), auth.ts (HMAC sessions)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)

## Architecture decisions

- **No database for rates**: Gold rate history is stored in a flat JSON file (`rate-history.json`). This was the original design and works well for this use case (append-only daily updates).
- **HMAC session cookies**: Admin auth uses HMAC-signed cookies (no JWT library needed) with rate limiting. Requires `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` env vars.
- **Wouter over React Router**: Scaffold default; lightweight and works well with Vite.
- **Fallback rates**: API falls back to hardcoded rates if rate-history.json is missing/unreadable, preventing 500 errors.
- **Live price estimates**: Jewellery product prices are calculated client-side using today's fetched 22K rate + making charges + 3% GST.

## Product

- **Gold Rate Today**: Live 22K/24K/18K gold and silver rates for Tirupur with trend indicator
- **Gold Rate History**: Historical rate table + visual bar chart for last 7 days
- **Gold Rate by Date**: Archived rate lookup for any past date
- **Silver Rate**: Fine silver 1g and 1kg prices
- **Jewellery Collections**: Gold Necklaces, Bangles, Rings with live price estimates
- **Blog**: 5 educational articles about gold purity, BIS hallmarking, investment guides
- **Calculator**: Interactive gold value estimator with weight/purity/making charge sliders
- **Admin Panel**: Login-protected dashboard (requires env vars to enable)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The API server reads `rate-history.json` using `REPL_HOME` env var to find the workspace root. If deploying, ensure the data file is accessible.
- Admin login returns 503 if `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` are not set.
- Gold rate fetching from live APIs (metalpriceapi.com) is NOT yet implemented in the Express backend — it reads from the static JSON file only.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Migration source backed up in `.migration-backup/` (original Next.js files)
