import type { Request, Response } from 'express';
import {
  DEFAULT_NEWSLETTER_SOURCE,
  isNewsletterSource,
  subscribeToNewsletter,
} from '../services/newsletter.service';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/HttpError';
import { optionalString, requireBody, requiredEmail } from '../utils/validation';

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const body = requireBody(req.body);

  const email = requiredEmail(body, 'email', { lowercase: true });

  // Absent, null or blank -> 'unknown'; anything else must be one of the known sources.
  const rawSource = optionalString(body, 'source', { label: 'Source', max: 50 });
  if (rawSource !== undefined && !isNewsletterSource(rawSource)) throw new HttpError(400, 'Invalid source.');

  await subscribeToNewsletter(email, rawSource ?? DEFAULT_NEWSLETTER_SOURCE);

  // Same response for new and repeat sign-ups; the subscriber record is never returned.
  res.status(201).json({ success: true });
});
