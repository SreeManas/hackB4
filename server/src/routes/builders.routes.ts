import { Router } from 'express';
import { getBuilders } from '../controllers/builders.controller';

const router = Router();

router.get('/', getBuilders);

export default router;
