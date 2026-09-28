import type { Request, Response } from 'express';
import { createContactMessage } from '../services/contact.service';
import { notifyContactSubmission } from '../services/notify/submissionNotifications';
import { asyncHandler } from '../utils/asyncHandler';
import { requireBody, requiredEmail, requiredString } from '../utils/validation';

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const body = requireBody(req.body);

  const submission = {
    name: requiredString(body, 'name', { label: 'Name', max: 120 }),
    email: requiredEmail(body),
    message: requiredString(body, 'message', { label: 'Message', max: 2000 }),
  };

  await createContactMessage(submission);
  // Best-effort internal alert; never throws, so it cannot affect the response or the write above.
  await notifyContactSubmission(submission);

  res.status(201).json({ success: true });
});
