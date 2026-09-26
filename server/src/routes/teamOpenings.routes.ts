import { Router } from 'express';
import { getTeamOpenings } from '../controllers/teamOpenings.controller';

const router = Router();

router.get('/', getTeamOpenings);

export default router;
