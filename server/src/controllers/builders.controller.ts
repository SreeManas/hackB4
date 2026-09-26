import type { Request, Response } from 'express';
import { listBuilders } from '../services/builders.service';
import { asyncHandler } from '../utils/asyncHandler';
import { parseFeatured } from '../utils/query';

export const getBuilders = asyncHandler(async (req: Request, res: Response) => {
  // `?featured=true` is still validated (anything else is a 400) but no longer changes the result:
  // only opted-in (featured) builders are ever public.
  parseFeatured(req.query.featured);

  res.json(await listBuilders());
});
