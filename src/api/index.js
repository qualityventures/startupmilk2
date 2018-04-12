import { Router } from 'express';
import userRoutes from './routes.user';
import authRoutes from './routes.auth';
import productsRoutes from './routes.products';

const router = new Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/products', productsRoutes);

export default router;
