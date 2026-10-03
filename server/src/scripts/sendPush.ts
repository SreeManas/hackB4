import { parseArgs } from 'node:util';
import { prisma } from '../config/prisma';
import { webPushConfigProblem } from '../config/webPush';
import { broadcast, buildPayload, countDeliverable } from '../services/notify/webPushSender';

/**
 * Manually broadcasts a browser notification to every active subscriber.
 *
 *   npm run push:send -- --title "New hackathon" --body "Registrations are open" --url /events
 *   npm run push:send -- --title "..." --body "..." --dry-run     (counts recipients, sends nothing)
 *
 * Reads server/.env like the API. Prints counts only - never endpoints, keys or secrets.
 */

const USAGE = 'Usage: npm run push:send -- --title "<title>" --body "<text>" [--url /events] [--dry-run]';

async function main(): Promise<number> {
  const { values } = parseArgs({
    options: {
      title: { type: 'string' },
      body: { type: 'string' },
      url: { type: 'string', default: '/events' },
      'dry-run': { type: 'boolean', default: false },
    },
    strict: true,
  });

  let payload: string;
  try {
    payload = buildPayload({ title: values.title ?? '', body: values.body ?? '', url: values.url ?? '/events' });
  } catch (err) {
    console.error(`${(err as Error).message}\n${USAGE}`);
    return 1;
  }

  if (values['dry-run']) {
    console.log(`Dry run: ${await countDeliverable()} active subscription(s) would receive this notification.`);
    return 0;
  }

  const problem = webPushConfigProblem();
  if (problem) {
    console.error(`Web Push is not configured: ${problem}. See server/.env.example.`);
    return 1;
  }

  const r = await broadcast(payload);
  console.log(
    `Sent ${r.sent}/${r.total}. Deactivated ${r.deactivated} expired subscription(s). Failed ${r.failed}` +
      (r.failed > 0
        ? ` (${Object.entries(r.failures)
            .map(([k, n]) => `${k}: ${n}`)
            .join(', ')})`
        : '') +
      '.',
  );
  return 0;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err) => {
    console.error(`Failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
