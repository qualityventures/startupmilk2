import { Router } from 'express';
import userRoutes from './routes.user';
import authRoutes from './routes.auth';
import cartRoutes from './routes.cart';
import productsRoutes from './routes.products';

const router = new Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/cart', cartRoutes);
router.use('/products', productsRoutes);

export default router;
