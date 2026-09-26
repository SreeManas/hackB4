import type { Request, Response } from 'express';
import { createContactMessage } from '../services/contact.service';
import { asyncHandler } from '../utils/asyncHandler';
import { requireBody, requiredEmail, requiredString } from '../utils/validation';

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const body = requireBody(req.body);

  await createContactMessage({
    name: requiredString(body, 'name', { label: 'Name', max: 120 }),
    email: requiredEmail(body),
    message: requiredString(body, 'message', { label: 'Message', max: 2000 }),
  });

  res.status(201).json({ success: true });
});
