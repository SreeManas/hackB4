import { PrismaClient } from '@prisma/client';
import './env'; // ensure .env is loaded before Prisma reads DATABASE_URL
import { runOperation } from '../utils/dbRetry';

const base = new PrismaClient();

/**
 * Single shared Prisma client. Every operation goes through the small P1001 retry policy in
 * utils/dbRetry.ts (reads retry; writes probe the connection first and then run exactly once).
 */
export const prisma = base.$extends({
  name: 'transient-connection-retry',
  query: {
    $allOperations: ({ operation, args, query }) =>
      runOperation(
        operation,
        () => query(args),
        () => base.$queryRaw`SELECT 1`,
        {
          onRetry: (attempt, max) =>
            console.warn(`[db] transient connection error on "${operation}", retry ${attempt}/${max}`),
        },
      ),
  },
});
