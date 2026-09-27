/**
 * Prisma's default `connect_timeout` is 5 seconds. Opening one connection through the Supabase pooler
 * takes ~6 network round trips (TCP, SSLRequest, TLS, startup, SCRAM x2), so on a link with a ~400 ms
 * round trip a cold connect measures 5.4-6.3 s: with the default, 6 of 8 cold connections failed with
 * P1001; with a longer timeout all succeeded. A connection that is merely slow to open is not an outage.
 *
 * 10 s leaves comfortable headroom for that handshake and still fails fast when the database is
 * genuinely unreachable (an unreachable host is refused immediately and never waits this long).
 */
export const DEFAULT_CONNECT_TIMEOUT_SECONDS = 10;

/**
 * Returns `url` with `connect_timeout` appended unless the URL already sets one (an explicit value in
 * DATABASE_URL always wins). Plain string handling on purpose: the URL carries credentials and must be
 * passed through byte-for-byte, never re-parsed or re-encoded.
 */
export function withConnectTimeout(url: string, seconds: number = DEFAULT_CONNECT_TIMEOUT_SECONDS): string {
  if (!url || /[?&]connect_timeout=/i.test(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}connect_timeout=${seconds}`;
}
