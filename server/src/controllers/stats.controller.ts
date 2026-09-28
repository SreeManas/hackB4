import type { Request, Response } from 'express';
import { getStats } from '../services/stats.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getPlatformStats = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await getStats());
});
