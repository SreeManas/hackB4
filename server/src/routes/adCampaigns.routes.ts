import { Router } from 'express';
import { getActiveAdCampaign } from '../controllers/adCampaigns.controller';

const router = Router();

router.get('/active', getActiveAdCampaign);

export default router;
