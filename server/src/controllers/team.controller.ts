import type { Request, Response } from 'express';
import { listTeamMembers } from '../services/team.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getTeam = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await listTeamMembers());
});
