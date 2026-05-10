import { Router } from 'express';
import * as share from '../controllers/share.controller';

const router = Router();

// Public - no auth required
router.get('/:shareToken', share.getSharedTrip);

export default router;
