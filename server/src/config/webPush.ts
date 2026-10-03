import { env } from './env';

/**
 * Browser Web Push (standards-based Web Push + VAPID, no third-party push account).
 *
 * Sending is optional: without a valid VAPID configuration the API still accepts and stores
 * subscriptions (POST /notifications/subscribe never depends on it); only the broadcast sender
 * (services/notify/webPushSender.ts, `npm run push:send`) needs it. A missing or malformed value is
 * reported by name at startup - never by value - and never crashes the server.
 */

export interface VapidDetails {
  subject: string;
  publicKey: string;
  privateKey: string;
}

const BASE64URL = /^[A-Za-z0-9_-]+$/;

/** Decoded length of a base64url string, or -1 when it is not base64url. */
const decodedLength = (value: string): number => (BASE64URL.test(value) ? Buffer.from(value, 'base64url').length : -1);

/**
 * Why Web Push can't send, as a message that names variables but never prints values, or null when
 * the configuration is complete and well-formed.
 */
export function webPushConfigProblem(): string | null {
  const { publicKey, privateKey, subject } = env.vapid;

  const missing = [
    !publicKey && 'VAPID_PUBLIC_KEY',
    !privateKey && 'VAPID_PRIVATE_KEY',
    !subject && 'VAPID_SUBJECT',
  ].filter(Boolean);
  if (missing.length > 0) return `${missing.join(', ')} not set`;

  // An uncompressed P-256 public key is 65 bytes; the private scalar is 32.
  if (decodedLength(publicKey) !== 65) return 'VAPID_PUBLIC_KEY is not a valid VAPID public key';
  if (decodedLength(privateKey) !== 32) return 'VAPID_PRIVATE_KEY is not a valid VAPID private key';
  if (!/^(mailto:[^\s@]+@[^\s@]+|https:\/\/\S+)$/.test(subject)) {
    return 'VAPID_SUBJECT must be a mailto: address or an https: URL';
  }
  return null;
}

export const isWebPushConfigured = (): boolean => webPushConfigProblem() === null;

export function vapidDetails(): VapidDetails {
  return { subject: env.vapid.subject, publicKey: env.vapid.publicKey, privateKey: env.vapid.privateKey };
}

/** Logged once at startup so missing config is visible without spamming per-request logs. */
export function logWebPushConfigStatus(): void {
  const problem = webPushConfigProblem();
  if (problem) {
    console.warn(
      `[push] sending browser notifications is disabled (${problem}). Subscriptions are still stored normally.`,
    );
  }
}
