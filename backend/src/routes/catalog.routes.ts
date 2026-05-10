import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as activity from '../controllers/activity.controller';

const router = Router();

router.get('/cities', activity.getCities);
router.get('/cities/:id/activities', activity.getCityActivities);
router.get('/activities', activity.getActivities);

export default router;
