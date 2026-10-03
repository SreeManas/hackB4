import webpush from 'web-push';
import { prisma } from '../../config/prisma';
import { vapidDetails, webPushConfigProblem } from '../../config/webPush';

/**
 * Broadcasts a browser notification to every active Web Push subscription.
 *
 * Triggered only from the `npm run push:send` script - there is deliberately no HTTP route for it,
 * because the project has no admin authentication. A push service answering 404 or 410 means the
 * subscription is gone for good (user revoked permission / cleared site data), so those rows are
 * marked inactive and never retried; any other failure is only counted, so a temporary outage can't
 * switch off healthy subscriptions.
 */

export interface PushPayload {
  title: string;
  body: string;
  /** Site-relative path opened when the notification is clicked, e.g. "/events/spring-hack". */
  url: string;
}

export interface PushTarget {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

/** One encrypted delivery attempt. Rejects with an error carrying `statusCode` when the push service refuses. */
export type PushTransport = (target: PushTarget, payload: string) => Promise<void>;

export interface BroadcastResult {
  /** Active subscriptions that were attempted. */
  total: number;
  sent: number;
  /** Subscriptions the push service reported gone (404/410), now marked inactive. */
  deactivated: number;
  failed: number;
  /** Failed attempts grouped by HTTP status ("network" when there was none). Never contains endpoints. */
  failures: Record<string, number>;
}

const TITLE_MAX = 100;
const BODY_MAX = 300;
const URL_MAX = 500;
/** Push services reject payloads over ~4 KB; stay clear of it. */
const PAYLOAD_MAX_BYTES = 3500;
const BATCH_SIZE = 500;
const CONCURRENCY = 20;
const TTL_SECONDS = 24 * 60 * 60;
const REQUEST_TIMEOUT_MS = 10_000;
const GONE_STATUSES = new Set([404, 410]);

/** Validates the message and returns the exact string that is encrypted and sent. */
export function buildPayload({ title, body, url }: PushPayload): string {
  const clean = (value: string) => value.trim();
  const t = clean(title);
  const b = clean(body);
  const u = clean(url);

  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F]/.test(t + b + u))
    throw new Error('Title, body and url cannot contain control characters.');
  if (!t || Array.from(t).length > TITLE_MAX) throw new Error(`Title is required (max ${TITLE_MAX} characters).`);
  if (!b || Array.from(b).length > BODY_MAX) throw new Error(`Body is required (max ${BODY_MAX} characters).`);
  if (!u.startsWith('/') || u.startsWith('//') || u.includes('\\') || u.length > URL_MAX) {
    throw new Error('Url must be a site path starting with a single "/", e.g. /events.');
  }

  const payload = JSON.stringify({ title: t, body: b, url: u });
  if (Buffer.byteLength(payload) > PAYLOAD_MAX_BYTES) throw new Error('Notification is too large.');
  return payload;
}

const webPushTransport: PushTransport = async (target, payload) => {
  await webpush.sendNotification(target, payload, {
    vapidDetails: vapidDetails(),
    TTL: TTL_SECONDS,
    timeout: REQUEST_TIMEOUT_MS,
  });
};

const deliverable = { isActive: true, p256dh: { not: null }, auth: { not: null } } as const;

/** How many subscriptions a broadcast would currently reach. */
export const countDeliverable = (): Promise<number> => prisma.pushSubscription.count({ where: deliverable });

const statusOf = (err: unknown): number | undefined => {
  const status = (err as { statusCode?: unknown } | null)?.statusCode;
  return typeof status === 'number' ? status : undefined;
};

/** Runs `worker` over `items` with at most `limit` in flight. */
async function inPool<T>(items: readonly T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) await worker(items[next++] as T);
  });
  await Promise.all(runners);
}

/**
 * Sends `payload` (from buildPayload) to every active subscription. Throws if Web Push isn't
 * configured (unless a custom transport is supplied, which tests use).
 */
export async function broadcast(payload: string, transport?: PushTransport): Promise<BroadcastResult> {
  if (!transport) {
    const problem = webPushConfigProblem();
    if (problem) throw new Error(`Web Push is not configured: ${problem}.`);
  }
  const send = transport ?? webPushTransport;
  const result: BroadcastResult = { total: 0, sent: 0, deactivated: 0, failed: 0, failures: {} };

  let cursor: string | undefined;
  for (;;) {
    const batch = await prisma.pushSubscription.findMany({
      where: deliverable,
      orderBy: { id: 'asc' },
      take: BATCH_SIZE,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: { id: true, endpoint: true, p256dh: true, auth: true },
    });
    if (batch.length === 0) break;
    cursor = batch[batch.length - 1]!.id;
    result.total += batch.length;

    const gone: string[] = [];
    await inPool(batch, CONCURRENCY, async (row) => {
      try {
        // Non-null by the `deliverable` filter.
        await send({ endpoint: row.endpoint, keys: { p256dh: row.p256dh!, auth: row.auth! } }, payload);
        result.sent++;
      } catch (err) {
        const status = statusOf(err);
        if (status !== undefined && GONE_STATUSES.has(status)) {
          gone.push(row.id);
          result.deactivated++;
        } else {
          result.failed++;
          const key = status === undefined ? 'network' : String(status);
          result.failures[key] = (result.failures[key] ?? 0) + 1;
        }
      }
    });

    if (gone.length > 0) {
      await prisma.pushSubscription.updateMany({
        where: { id: { in: gone } },
        data: { isActive: false, updatedAt: new Date() },
      });
    }
    if (batch.length < BATCH_SIZE) break;
  }
  return result;
}
