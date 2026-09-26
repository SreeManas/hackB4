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

| Script                    | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start with hot reload (tsx)              |
| `npm run build`           | Compile TypeScript to `dist/`            |
| `npm start`               | Run the compiled server                  |
| `npm run typecheck`       | Type-check without emitting              |
| `npm run prisma:generate` | Generate the Prisma client               |
| `npm run prisma:migrate`  | `prisma migrate dev` (needs a database)  |

## Environment

See `.env.example`: `PORT`, `CORS_ORIGINS`, `DATABASE_URL` (pooled), `DIRECT_URL` (direct, for migrations).

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
