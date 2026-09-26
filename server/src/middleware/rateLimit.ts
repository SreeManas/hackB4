import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';

/**
 * In-memory limiter keyed by client IP (never persisted). It is per process, which is enough for a
 * single instance; a shared store would be needed if the API is scaled horizontally.
 * Deliberately generous: normal use (a form or two, a few conversion pings) never gets near it.
 */
const limiter = rateLimit({
  windowMs: env.postRateLimit.windowMs,
  limit: env.postRateLimit.max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ message: 'Too many requests. Please try again in a minute.' });
  },
});

/** Applies the limiter to POST requests only; GET and OPTIONS are never limited. */
export const postRateLimit: RequestHandler = (req, res, next) => {
  if (req.method !== 'POST') return next();
  return limiter(req, res, next);
};
