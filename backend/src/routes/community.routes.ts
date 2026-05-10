import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as community from '../controllers/community.controller';

const router = Router();

router.get('/', community.getPosts);
router.post('/', authMiddleware, community.createPost);
router.post('/:id/react', authMiddleware, community.reactToPost);

export default router;
