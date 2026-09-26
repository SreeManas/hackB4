import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

const port = Number(process.env.PORT ?? 4000);

/** Positive integer from an env var, or the fallback when unset/blank. Invalid values fail fast at startup. */
function positiveInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  if (!/^\d+$/.test(raw) || Number(raw) < 1) throw new Error(`${name} must be a positive integer`);
  return Number(raw);
}

/**
 * Number of reverse-proxy hops to trust for req.ip (X-Forwarded-For).
 * Unset: 1 hop in production (typical single platform proxy), none in development.
 * Blanket `true` is intentionally not supported: it lets clients spoof their IP.
 */
function trustProxy(): number | false {
  const raw = process.env.TRUST_PROXY?.trim();
  if (!raw) return isProd ? 1 : false;
  if (raw === 'false' || raw === '0') return false;
  if (!/^\d+$/.test(raw)) throw new Error('TRUST_PROXY must be a number of proxy hops (or 0/false)');
  return Number(raw);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProd,
  port: Number.isFinite(port) ? port : 4000,
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  /** Vercel project name whose preview deployments (<name>-*.vercel.app) may call the API. */
  corsVercelProject: (process.env.CORS_VERCEL_PROJECT ?? 'hackb4').trim().toLowerCase(),
  trustProxy: trustProxy(),
  postRateLimit: {
    windowMs: positiveInt('RATE_LIMIT_POST_WINDOW_MS', 10 * 60_000),
    max: positiveInt('RATE_LIMIT_POST_MAX', 30),
  },
  databaseUrl: process.env.DATABASE_URL ?? '',
  directUrl: process.env.DIRECT_URL ?? '',
} as const;
