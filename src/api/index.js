import { Router } from 'express';
import userRoutes from './routes.user';
import authRoutes from './routes.auth';
import cartRoutes from './routes.cart';
import productsRoutes from './routes.products';
import ordersRoutes from './routes.orders';

const router = new Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/cart', cartRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);

export default router;
