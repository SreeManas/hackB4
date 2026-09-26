import type { Request, Response } from 'express';
import { findActiveAdCampaign } from '../services/adCampaigns.service';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/HttpError';

export const getActiveAdCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.query;
  // `page` is a required part of the contract (GET /ad-campaigns/active?page=/events).
  if (typeof page !== 'string' || page.length === 0) throw new HttpError(400, 'A page is required.');

  // No campaign is a normal outcome: 200 with a literal `null` body, never 404.
  res.json(await findActiveAdCampaign(page));
});
