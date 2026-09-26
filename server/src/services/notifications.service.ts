import { prisma } from '../config/prisma';

/**
 * Registers a push token. Idempotent: `device_token` is unique, so a repeat token updates the
 * existing row (and re-activates it) instead of creating a duplicate. Prisma turns this upsert on a
 * unique field into a single atomic INSERT ... ON CONFLICT, which is safe under concurrent requests.
 *
 * Delivery is out of scope: tokens are only stored (the frontend currently sends a placeholder token).
 */
export async function subscribeDevice(deviceToken: string): Promise<void> {
  await prisma.pushSubscription.upsert({
    where: { deviceToken },
    create: { deviceToken },
    update: { isActive: true, updatedAt: new Date() },
  });
}
