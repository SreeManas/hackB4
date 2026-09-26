import type { Request, Response } from 'express';
import { listProjects } from '../services/projects.service';
import { asyncHandler } from '../utils/asyncHandler';
import { parseFeatured } from '../utils/query';

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  res.json(await listProjects({ featuredOnly: parseFeatured(req.query.featured) }));
});
