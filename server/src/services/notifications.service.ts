import { prisma } from '../config/prisma';
import type { DeviceInfo } from '../utils/userAgent';
import type { PushSubscriptionInput } from '../utils/validation';

/**
 * Registers a Web Push subscription. Idempotent: `endpoint` is unique, so the same browser
 * subscribing again updates its existing row (keys refreshed, re-activated) instead of creating a
 * duplicate. Prisma turns this upsert on a unique field into a single atomic INSERT ... ON CONFLICT,
 * which is safe under concurrent requests.
 *
 * Delivery lives in services/notify/webPushSender.ts; this only stores the subscription.
 */
export async function subscribeDevice(
  { endpoint, p256dh, auth }: PushSubscriptionInput,
  { browser, os }: DeviceInfo,
): Promise<void> {
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { endpoint, p256dh, auth, browser, os },
    update: { p256dh, auth, browser, os, isActive: true, updatedAt: new Date() },
  });
}
