import { Router } from 'express';
import submitRoutes from './routes.submit';

const router = new Router();

router.use('/submit', submitRoutes);

export default router;
