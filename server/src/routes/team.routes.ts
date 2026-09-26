import { Router } from 'express';
import { getTeam } from '../controllers/team.controller';

const router = Router();

router.get('/', getTeam);

export default router;
