/** Typed, centralised access to build-time environment variables. */
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

export const env = {
  apiBaseUrl,
  /** Mocks are used when no API is configured, or when explicitly forced. */
  useMocks: !apiBaseUrl || import.meta.env.VITE_USE_MOCKS === 'true',
  siteUrl: (import.meta.env.VITE_SITE_URL ?? 'https://hackb4.com').replace(/\/+$/, ''),
  isDev: import.meta.env.DEV,
} as const;
