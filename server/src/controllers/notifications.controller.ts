import type { Request, Response } from 'express';
import { subscribeDevice } from '../services/notifications.service';
import { asyncHandler } from '../utils/asyncHandler';
import { deviceFromUserAgent } from '../utils/userAgent';
import { requireBody, requiredPushSubscription } from '../utils/validation';

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const body = requireBody(req.body);

  await subscribeDevice(requiredPushSubscription(body), deviceFromUserAgent(req.get('user-agent')));

  res.status(201).json({ success: true });
});
