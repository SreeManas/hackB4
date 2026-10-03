import type { PushSubscriptionPayload } from '@/lib/api';

/** Why a browser push subscription could not be created. */
export type PushFailure =
  /** The browser has no service worker / Push API / Notification API (e.g. iOS Safari outside a Home Screen app). */
  | 'unsupported'
  /** The visitor blocked notifications for this site. */
  | 'denied'
  /** The permission prompt was closed without an answer. */
  | 'dismissed'
  /** No VAPID key configured, or the browser's push service could not be reached. */
  | 'unavailable';

export class PushError extends Error {
  constructor(readonly reason: PushFailure) {
    super(reason);
    this.name = 'PushError';
  }
}

const SERVICE_WORKER_URL = '/sw.js';

export const isPushSupported = (): boolean =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

/** The URL-safe base64 VAPID public key, as the bytes `PushManager.subscribe` expects. */
function keyToBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(base64url.length / 4) * 4, '=');
  const raw = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

const sameKey = (current: ArrayBuffer | null, wanted: Uint8Array): boolean =>
  current !== null && current.byteLength === wanted.length && new Uint8Array(current).every((b, i) => b === wanted[i]);

/**
 * Asks for notification permission, registers the service worker and subscribes this browser to Web
 * Push with the site's VAPID key. Must run from a click: browsers only show the permission prompt for
 * a user gesture. Re-running it returns the same subscription, so it is safe to retry.
 */
export async function createPushSubscription(vapidPublicKey: string): Promise<PushSubscriptionPayload> {
  if (!isPushSupported()) throw new PushError('unsupported');
  if (!vapidPublicKey) throw new PushError('unavailable');
  if (Notification.permission === 'denied') throw new PushError('denied');

  const permission = await Notification.requestPermission();
  if (permission === 'denied') throw new PushError('denied');
  if (permission !== 'granted') throw new PushError('dismissed');

  try {
    await navigator.serviceWorker.register(SERVICE_WORKER_URL);
    const registration = await navigator.serviceWorker.ready;
    const applicationServerKey = keyToBytes(vapidPublicKey);

    let subscription = await registration.pushManager.getSubscription();
    // A subscription is bound to the key it was made with; after a key change it can never be delivered to.
    if (subscription && !sameKey(subscription.options.applicationServerKey, applicationServerKey)) {
      await subscription.unsubscribe();
      subscription = null;
    }
    subscription ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });

    const { endpoint, keys } = subscription.toJSON();
    if (!endpoint || !keys?.p256dh || !keys.auth) throw new Error('Incomplete push subscription');
    return { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } };
  } catch (err) {
    // The browser's push service is unreachable or disabled (e.g. Chromium builds without Google services).
    if (err instanceof DOMException && ['AbortError', 'NotSupportedError', 'InvalidStateError'].includes(err.name)) {
      throw new PushError('unavailable');
    }
    if (err instanceof DOMException && err.name === 'NotAllowedError') throw new PushError('denied');
    throw err;
  }
}
