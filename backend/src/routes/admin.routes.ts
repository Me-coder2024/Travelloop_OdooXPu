import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';
import * as admin from '../controllers/admin.controller';

const router = Router();

router.get('/stats', authMiddleware, adminOnly, admin.getStats);
router.get('/users', authMiddleware, adminOnly, admin.getUsers);
router.patch('/users/:id', authMiddleware, adminOnly, admin.updateUser);

export default router;
