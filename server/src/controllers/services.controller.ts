import type { Request, Response } from 'express';
import { listServices } from '../services/services.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getServices = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await listServices());
});
