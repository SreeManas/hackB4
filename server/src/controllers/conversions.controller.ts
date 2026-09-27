import type { Request, Response } from 'express';
import { recordConversion } from '../services/conversions.service';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/HttpError';
import { isUuid, optionalString, requireBody, requiredString } from '../utils/validation';

const USER_AGENT_MAX = 300;

/** User-Agent as sent by the browser, control characters removed and length capped. */
function userAgentOf(req: Request): string | null {
  const raw = req.get('user-agent');
  const cleaned = raw
    ?.replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, USER_AGENT_MAX);
  return cleaned || null;
}

/** Referring page reduced to origin + path: query strings and fragments can carry personal data. */
function referrerOf(req: Request): string | null {
  const raw = req.get('referer');
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return (url.origin + url.pathname).slice(0, 300);
  } catch {
    return null;
  }
}

export const trackConversion = asyncHandler(async (req: Request, res: Response) => {
  const eventId = String(req.params.id);
  // A malformed id can never match an event: answer like an unknown one, without touching the database.
  if (!isUuid(eventId)) throw new HttpError(404, 'Event not found');

  const body = requireBody(req.body);
  const recorded = await recordConversion({
    eventId: eventId.toLowerCase(),
    source: requiredString(body, 'source', { label: 'Source', max: 50 }),
    medium: requiredString(body, 'medium', { label: 'Medium', max: 50 }),
    campaign: optionalString(body, 'campaign', { label: 'Campaign', max: 100 }),
    // No IP address is read or stored.
    userAgent: userAgentOf(req),
    referrer: referrerOf(req),
  });
  if (!recorded) throw new HttpError(404, 'Event not found');

  // Fire-and-forget on the client: success is an empty 204.
  res.status(204).end();
});
