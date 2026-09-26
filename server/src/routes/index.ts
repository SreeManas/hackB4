import { Router } from 'express';
import { health } from '../controllers/health.controller';
import activityRoutes from './activity.routes';
import adCampaignsRoutes from './adCampaigns.routes';
import buildersRoutes from './builders.routes';
import contactRoutes from './contact.routes';
import eventsRoutes from './events.routes';
import newsletterRoutes from './newsletter.routes';
import notificationsRoutes from './notifications.routes';
import projectsRoutes from './projects.routes';
import serviceInquiriesRoutes from './serviceInquiries.routes';
import servicesRoutes from './services.routes';
import teamRoutes from './team.routes';
import teamOpeningsRoutes from './teamOpenings.routes';

const router = Router();

router.get('/health', health);
router.use('/activity', activityRoutes);
router.use('/ad-campaigns', adCampaignsRoutes);
router.use('/builders', buildersRoutes);
router.use('/contact', contactRoutes);
router.use('/events', eventsRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/projects', projectsRoutes);
router.use('/service-inquiries', serviceInquiriesRoutes);
router.use('/services', servicesRoutes);
router.use('/team', teamRoutes);
router.use('/team-openings', teamOpeningsRoutes);

export default router;
