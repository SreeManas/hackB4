/**
 * Small, targeted retry for transient database *connection* failures (Prisma P1001,
 * "Can't reach database server"). Nothing else is ever retried: validation errors, constraint
 * violations (P2002, ...), timeouts (P2024), application errors and 4xx flows all fail immediately.
 *
 * Duplicate-write safety comes from the policy in `runOperation`, not from the retry itself:
 * writes are never re-sent. Only side-effect-free reads are retried directly; before a write, a
 * harmless `SELECT 1` probe is retried until a connection exists, and the write itself then runs
 * exactly once.
 */

export const MAX_RETRIES = 2;
/** Backoff before retry 1 and retry 2. */
export const RETRY_DELAYS_MS = [250, 750] as const;

export interface RetryOptions {
  retries?: number;
  delaysMs?: readonly number[];
  onRetry?: (attempt: number, max: number) => void;
}

/** True only for "could not reach the database server" — nothing was sent to the database. */
export function isTransientConnectionError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const e = err as { name?: string; code?: string; errorCode?: string; message?: string };

  // Query-time failure: PrismaClientKnownRequestError with code P1001.
  if (e.code === 'P1001') return true;

  // Connect-time failure: PrismaClientInitializationError (its errorCode is not always populated).
  if (e.name === 'PrismaClientInitializationError') {
    return e.errorCode === 'P1001' || /Can't reach database server/i.test(e.message ?? '');
  }
  return false;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Runs `fn`, retrying only transient connection errors, at most `retries` extra times. */
export async function withConnectionRetry<T>(
  fn: () => Promise<T>,
  { retries = MAX_RETRIES, delaysMs = RETRY_DELAYS_MS, onRetry }: RetryOptions = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries || !isTransientConnectionError(err)) throw err;
      onRetry?.(attempt + 1, retries);
      await sleep(delaysMs[Math.min(attempt, delaysMs.length - 1)] ?? 0);
    }
  }
}

/** Operations that only read and can be repeated freely. Everything else is treated as a write. */
export const READ_OPERATIONS: ReadonlySet<string> = new Set([
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'findUnique',
  'findUniqueOrThrow',
  'count',
  'aggregate',
  'groupBy',
]);

/**
 * Applies the retry policy to one Prisma operation.
 * - read: retried on transient connection errors.
 * - anything else (create, upsert, raw SQL, ...): `probe` is retried until the database is reachable,
 *   then `exec` runs exactly once. If the probe never succeeds, the write is never attempted.
 */
export async function runOperation<T>(
  operation: string,
  exec: () => Promise<T>,
  probe: () => Promise<unknown>,
  options?: RetryOptions,
): Promise<T> {
  if (READ_OPERATIONS.has(operation)) return withConnectionRetry(exec, options);

  await withConnectionRetry(probe, options);
  return exec();
}
