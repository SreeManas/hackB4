import { HttpError } from './HttpError';

/**
 * Request-body / scalar validation for the public POST endpoints.
 * Every failure is an HttpError(400) with a message that is safe to show to end users.
 *
 * Distinguishes: missing (absent/null) · empty (blank after trimming) · invalid (wrong type,
 * too long, bad characters).
 */

export const EMAIL_MAX = 254;

const bad = (message: string): never => {
  throw new HttpError(400, message);
};

// Control characters (incl. NUL, which PostgreSQL rejects) are never valid in these fields.
// Tab/newline/carriage return are allowed for free-text messages.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

// Pragmatic address check: one "@", no whitespace, a dotted domain. Real verification happens by mail.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Length in characters (code points), matching how PostgreSQL counts VARCHAR(n). */
const charLength = (s: string): number => Array.from(s).length;

export type Body = Record<string, unknown>;

/** The JSON body must be a plain object (not missing, an array, or a scalar). */
export function requireBody(body: unknown): Body {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return bad('Request body must be a JSON object.');
  }
  return body as Body;
}

interface StringOptions {
  /** Human label used in messages, e.g. "Name". */
  label: string;
  max: number;
}

function readString(value: unknown, { label, max }: StringOptions): string {
  if (typeof value !== 'string') return bad(`${label} must be text.`);
  const trimmed = value.trim();
  if (CONTROL_CHARS.test(trimmed)) return bad(`${label} contains invalid characters.`);
  if (charLength(trimmed) > max) return bad(`${label} must be at most ${max} characters.`);
  return trimmed;
}

/** Required text: missing -> "is required", blank -> "cannot be empty". */
export function requiredString(body: Body, field: string, options: StringOptions): string {
  const value = body[field];
  if (value === undefined || value === null) return bad(`${options.label} is required.`);

  const trimmed = readString(value, options);
  if (trimmed.length === 0) return bad(`${options.label} cannot be empty.`);
  return trimmed;
}

/** Optional text: absent, null or blank -> undefined (so the key can be omitted); wrong type/too long -> error. */
export function optionalString(body: Body, field: string, options: StringOptions): string | undefined {
  const value = body[field];
  if (value === undefined || value === null) return undefined;

  const trimmed = readString(value, options);
  return trimmed.length === 0 ? undefined : trimmed;
}

interface EmailOptions {
  /** Store/compare lower-cased (newsletter). */
  lowercase?: boolean;
}

/** Required, trimmed, length-limited, well-formed email. */
export function requiredEmail(body: Body, field = 'email', { lowercase = false }: EmailOptions = {}): string {
  const value = body[field];
  if (value === undefined || value === null) return bad('Email is required.');
  if (typeof value !== 'string') return bad('Please enter a valid email address.');

  const email = value.trim();
  if (email.length === 0) return bad('Email cannot be empty.');
  if (charLength(email) > EMAIL_MAX || CONTROL_CHARS.test(email) || !EMAIL_SHAPE.test(email)) {
    return bad('Please enter a valid email address.');
  }
  return lowercase ? email.toLowerCase() : email;
}

/**
 * A query-string value that must be a single string. Repeated (`?a=1&a=2`) and object-style
 * (`?a[x]=1`) values are rejected. Returns undefined when absent.
 */
export function queryString(value: unknown, label: string, { max = 100 }: { max?: number } = {}): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return bad(`${label} is invalid.`);

  if (CONTROL_CHARS.test(value) || charLength(value) > max) return bad(`${label} is invalid.`);
  return value;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Canonical 8-4-4-4-12 UUID shape. Check before letting a value reach a UUID column. */
export const isUuid = (value: unknown): value is string => typeof value === 'string' && UUID.test(value);
