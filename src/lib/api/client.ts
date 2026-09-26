import { env } from '@/config/env';

/** Shown for anything the backend did not phrase for end users (5xx, network, unexpected payloads). */
export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Please check your connection and try again.';
const TIMEOUT_ERROR_MESSAGE = 'The request took too long. Please try again.';

/** Backend `message` strings longer than this are not treated as user-facing copy. */
const MAX_SERVER_MESSAGE_LENGTH = 300;

export type ApiErrorKind =
  /** The server answered with a non-2xx status. */
  | 'http'
  /** No usable response: server down, DNS, CORS blocked, offline, or API not configured. */
  | 'network'
  /** No response within the request timeout. */
  | 'timeout'
  /** A 2xx response whose body was not the JSON the API contract promises. */
  | 'invalid_response';

/**
 * Every failure of the API layer. `message` is always safe to show to end users; `body` and `status`
 * are for callers and debugging, never for display.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
    readonly kind: ApiErrorKind = 'http',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** The message to show for an error thrown by the API layer (anything else gets the fallback). */
export function getErrorMessage(err: unknown, fallback: string = GENERIC_ERROR_MESSAGE): string {
  return err instanceof ApiError && err.message ? err.message : fallback;
}

/**
 * User-facing text for a non-2xx response. The backend answers 4xx with `{ "message": "..." }`
 * written for end users (validation, 404, 413, 429). 5xx text is never trusted or displayed:
 * internal failures always read as the generic message.
 */
function messageForStatus(status: number, data: unknown): string {
  if (status >= 400 && status < 500) {
    const message = (data as { message?: unknown } | null | undefined)?.message;
    if (typeof message === 'string' && message.trim() && message.length <= MAX_SERVER_MESSAGE_LENGTH) {
      return message.trim();
    }
    if (status === 404) return 'Not found.';
    if (status === 429) return 'Too many requests. Please try again in a minute.';
  }
  return GENERIC_ERROR_MESSAGE;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeoutMs?: number;
}

/** Thin fetch wrapper: base URL, JSON, timeout, cancellation and one consistent error type. */
export async function request<T>(
  path: string,
  { body, timeoutMs = 15_000, signal, headers, ...init }: RequestOptions = {},
): Promise<T> {
  if (!env.apiBaseUrl) {
    throw new ApiError(GENERIC_ERROR_MESSAGE, 0, undefined, 'network');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), timeoutMs);
  signal?.addEventListener('abort', () => controller.abort(signal.reason), { once: true });

  let res: Response;
  try {
    res = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // A caller-initiated abort (e.g. React Query cancelling a query) must stay an abort, not an error.
    if (signal?.aborted) throw err;
    if (controller.signal.aborted) throw new ApiError(TIMEOUT_ERROR_MESSAGE, 0, undefined, 'timeout');
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0, undefined, 'network');
  } finally {
    clearTimeout(timeout);
  }

  // 204 (e.g. conversion tracking) has no body by contract.
  const data: unknown = res.status === 204 ? undefined : await res.json().catch(() => undefined);

  if (!res.ok) throw new ApiError(messageForStatus(res.status, data), res.status, data);

  // Success but not JSON (e.g. an HTML page from a wrong base URL): fail loudly instead of returning undefined.
  if (res.status !== 204 && data === undefined) {
    throw new ApiError(GENERIC_ERROR_MESSAGE, res.status, undefined, 'invalid_response');
  }
  return data as T;
}

type GetOptions = Omit<RequestOptions, 'body' | 'method'>;

/** `GET {base}{path}` → parsed JSON as `T`. */
export function get<T>(path: string, options?: GetOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'GET' });
}

/** `POST {base}{path}` with a JSON body → parsed JSON as `T` (`void` for 204 responses). */
export function post<T>(path: string, body?: unknown, options?: GetOptions): Promise<T> {
  return request<T>(path, { ...options, method: 'POST', body });
}
