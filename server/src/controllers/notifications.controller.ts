import type { Request, Response } from 'express';
import { subscribeDevice } from '../services/notifications.service';
import { asyncHandler } from '../utils/asyncHandler';
import { requireBody, requiredString } from '../utils/validation';

/** Real FCM tokens are a few hundred characters; the current placeholder ('fcm-token-<uuid>') is 46. */
const TOKEN_MAX = 2048;

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const body = requireBody(req.body);

  await subscribeDevice(requiredString(body, 'token', { label: 'Token', max: TOKEN_MAX }));

  res.status(201).json({ success: true });
});
