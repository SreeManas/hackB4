import type { Request, Response } from 'express';
import { listOpenTeamOpenings } from '../services/teamOpenings.service';
import { asyncHandler } from '../utils/asyncHandler';
import { parseLimit } from '../utils/query';

// The frontend sends limit=3.
export const getTeamOpenings = asyncHandler(async (req: Request, res: Response) => {
  res.json(await listOpenTeamOpenings(parseLimit(req.query.limit, { fallback: 3, max: 50 })));
});
