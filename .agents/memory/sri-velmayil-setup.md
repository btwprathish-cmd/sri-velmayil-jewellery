---
name: Sri Velmayil project setup
description: Key architectural facts about the Sri Velmayil Jewellery project — routing, tech stack, data layer.
---

## Tech Stack
- Frontend: React + Vite + wouter (client-side routing) — NOT Next.js
- Backend: Express API server (artifacts/api-server)
- Styling: Tailwind CSS
- State: React useState + TanStack Query

## Routing (wouter)
- Routes defined in `artifacts/sabarish/src/App.tsx`
- Collections hierarchy: `/jewellery-collections` → `/jewellery-collections/:metal` → `/jewellery-collections/:metal/:category`
- More specific routes must come BEFORE less specific ones in `<Switch>`
- Admin: `/admin/login`, `/admin/dashboard`

## Data
- `src/data/collections.json` — product data (flat JSON, each collection has `metal` and `category` fields)
- `src/data/rate-history.json` — gold/silver rate history (written by API server)
- Rate calculations in `artifacts/api-server/src/lib/live-rates.ts`

## Live Rates
- LOCAL_PREMIUM_PERCENT = 1.5 (Tamil Nadu market premium) — applied in buildRecord()
- API waterfall: MetalpriceAPI → GoldAPI + Frankfurter → cache → fallback
- Cache: 30 min in-memory

**Why:** The spec was written for Next.js App Router but the actual codebase uses wouter. All "file path" references in specs must be translated to the src/pages/ pattern.
