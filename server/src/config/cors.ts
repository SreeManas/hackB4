import type { CorsOptions } from 'cors';
import { env } from './env';

/** Always allowed, in addition to CORS_ORIGINS. */
const DEFAULT_ORIGINS = ['https://hackb4.com', 'https://www.hackb4.com', 'http://localhost:5173'];

const allowedOrigins = new Set([...DEFAULT_ORIGINS, ...env.corsOrigins]);

// Vercel preview URLs look like https://<project>-<hash|git-branch>-<team>.vercel.app.
// Anchored, https only, and tied to our project name so other people's *.vercel.app sites don't match.
const projectPattern = env.corsVercelProject.replace(/[^a-z0-9-]/g, '');
const vercelPreview = projectPattern ? new RegExp(`^https://${projectPattern}-[a-z0-9-]+\\.vercel\\.app$`) : null;

export const isAllowedOrigin = (origin: string): boolean =>
  allowedOrigins.has(origin) || (vercelPreview?.test(origin) ?? false);

export const corsOptions: CorsOptions = {
  // Requests without an Origin header (curl, server-to-server, same-origin) are not CORS requests.
  origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  maxAge: 600,
};
