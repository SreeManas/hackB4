import type { Request, Response } from 'express';
import { listActivity } from '../services/activity.service';
import { asyncHandler } from '../utils/asyncHandler';
import { parseLimit } from '../utils/query';

// The frontend sends limit=10.
export const getActivity = asyncHandler(async (req: Request, res: Response) => {
  res.json(await listActivity(parseLimit(req.query.limit, { fallback: 10, max: 50 })));
});
