import type { ErrorRequestHandler, RequestHandler } from 'express';
import { env } from '../config/env';
import { HttpError } from '../utils/HttpError';

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'Not found' });
};

/** Every error leaves as `{ message }` — the shape the frontend expects. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // body-parser errors carry a `type`; give the common ones a specific, user-safe message.
  const { status, type } = (err ?? {}) as { status?: number; type?: string };
  if (type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Invalid JSON in request body.' });
    return;
  }
  if (type === 'entity.too.large') {
    res.status(413).json({ message: 'Request body is too large.' });
    return;
  }

  // Other 4xx errors (bad encoding, aborted request, ...): safe generic message.
  if (typeof status === 'number' && status >= 400 && status < 500) {
    res.status(status).json({ message: status === 400 ? 'Invalid request' : 'Request rejected' });
    return;
  }

  if (!env.isProd) console.error(err);
  else console.error(err instanceof Error ? err.message : err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
};
