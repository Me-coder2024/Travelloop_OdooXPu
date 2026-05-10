import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as user from '../controllers/user.controller';

const router = Router();

router.get('/me', authMiddleware, user.getMe);
router.patch('/me', authMiddleware, user.updateMe);

export default router;
