import { Router } from 'express';
import { trackConversion } from '../controllers/conversions.controller';
import { getEventBySlug, getEvents } from '../controllers/events.controller';

const router = Router();

router.get('/', getEvents);
router.get('/:slug', getEventBySlug);
router.post('/:id/conversions', trackConversion);

export default router;
