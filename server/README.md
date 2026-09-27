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
