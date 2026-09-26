import { Router } from 'express';
import { submitServiceInquiry } from '../controllers/serviceInquiries.controller';

const router = Router();

router.post('/', submitServiceInquiry);

export default router;
