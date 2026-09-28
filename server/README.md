# HACKB4 Server

Standalone REST API for the HACKB4 frontend. Self-contained: it has its own `package.json` and is
not part of the frontend build. Stack: Node.js, TypeScript, Express, Prisma, PostgreSQL (Supabase).

## Status

Foundation only. No business endpoints, no Prisma models, no database connection yet.

## Setup

```bash
cd server
npm install
cp .env.example .env   # fill in values locally; never commit .env
npm run dev
```

Health check: `GET http://localhost:4000/api/health`

## Scripts

| Script                    | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `npm run dev`             | Start with hot reload (tsx)             |
| `npm run build`           | Compile TypeScript to `dist/`           |
| `npm start`               | Run the compiled server                 |
| `npm run typecheck`       | Type-check without emitting             |
| `npm run prisma:generate` | Generate the Prisma client              |
| `npm run prisma:migrate`  | `prisma migrate dev` (needs a database) |

## Environment

See `.env.example`: `PORT`, `CORS_ORIGINS`, `DATABASE_URL` (pooled), `DIRECT_URL` (direct, for migrations).

## Database connection and latency

Measured against Supabase (Sydney) from a link with a ~420 ms round trip to the pooler:

| Setting                                       | Warm read | Warm write | Notes                                              |
| --------------------------------------------- | --------- | ---------- | -------------------------------------------------- |
| Transaction pooler `:6543` + `pgbouncer=true` | ~2.0 s    | ~4.3 s     | Prisma needs ~5 round trips per query in this mode |
| Session pooler `:5432` (no `pgbouncer` flag)  | ~0.4 s    | ~0.85 s    | 1 round trip per query                             |

- Opening one connection takes ~6 round trips (TCP, SSLRequest, TLS, startup, SCRAM x2). Prisma's default
  `connect_timeout` of 5 s was shorter than that here, which showed up as intermittent `P1001` errors, so
  the app adds `connect_timeout=10` unless `DATABASE_URL` already sets one (`src/utils/dbUrl.ts`).
- Round trips dominate: host the API in the same region as the database (single-digit ms instead of hundreds).
- The P1001 retry policy (`src/utils/dbRetry.ts`) is unchanged: reads retry, writes probe once then run once.

## Push notifications

`POST /notifications/subscribe` (`src/controllers/notifications.controller.ts`,
`src/services/notifications.service.ts`) is fully implemented and functional as a **token store**:
validated (required, max 2048 chars, control characters rejected - `src/utils/validation.ts`),
idempotent (`device_token` is unique; a repeat token upserts the same row and re-activates it
instead of creating a duplicate), and goes through the same retry/error handling as every other
write.

What is **not** implemented, and can't be without a product decision: actually delivering a push.
The frontend's "Stay Updated" prompt (`src/features/engagement/PushOptIn.tsx`) does not call the
browser's `Notification`/`PushManager` APIs and has no service worker - it sends a placeholder
per-browser token (`fcm-token-<uuid>`, persisted in `localStorage` so retries reuse it) purely so
the storage/idempotency path can be exercised end-to-end. `handover/08_BACKEND_CHECKLIST_AND_OPEN_ITEMS.txt`
(open question 5) leaves the provider undecided - FCM or OneSignal, and who owns the account - and
that decision has to be made before real tokens exist.

If the team instead goes with standards-based Web Push (no FCM/OneSignal account needed - every
major browser implements it natively via a self-generated VAPID keypair), the required config is:

| Variable            | Where             | Notes                                                            |
| ------------------- | ----------------- | ---------------------------------------------------------------- |
| `VAPID_PUBLIC_KEY`  | server + frontend | Frontend var: `VITE_VAPID_PUBLIC_KEY` (public, safe client-side) |
| `VAPID_PRIVATE_KEY` | server only       | Never sent to the frontend                                       |
| `VAPID_SUBJECT`     | server only       | Contact URI the spec requires, e.g. `mailto:ops@hackb4.com`      |

None of these are set anywhere in this repo (`.env.example` only lists the names). A hosted
provider (FCM/OneSignal) would need different, provider-specific variables instead of these.

## Layout

```
src/
  config/       environment loading
  controllers/  request/response handlers
  middleware/   error handling
  routes/       route definitions (mounted under /api)
  services/     business logic
  utils/        shared helpers
  app.ts        Express app factory
  server.ts     HTTP entry point
prisma/schema.prisma   datasource + generator (no models yet)
```

## API conventions (from the frontend contract)

JSON, snake_case fields, errors as `{ "message": "..." }` with a non-2xx status, lists as bare arrays.
See `../docs/API_CONTRACT.md` and `../handover/04_API_ENDPOINTS_SPEC.txt`.
