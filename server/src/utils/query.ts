import { HttpError } from './HttpError';

/**
 * `?featured=true` — the only documented form. Absent means "no filter".
 * Anything else (false, 1, repeated params, ...) is rejected rather than guessed.
 */
export function parseFeatured(value: unknown): boolean {
  if (value === undefined) return false;
  if (value === 'true') return true;
  throw new HttpError(400, 'Invalid featured filter.');
}

/** Positive integer `?limit=`, with a default when absent and a hard upper bound. */
export function parseLimit(value: unknown, { fallback, max }: { fallback: number; max: number }): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d{1,4}$/.test(value)) throw new HttpError(400, 'Invalid limit.');

  const n = Number(value);
  if (n < 1 || n > max) throw new HttpError(400, 'Invalid limit.');
  return n;
}
