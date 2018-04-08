import { Router } from 'express';
import userRoutes from './routes.user';
import authRoutes from './routes.auth';

const router = new Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

export default router;
