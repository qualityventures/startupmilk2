import { Router } from 'express';
import {
  createNewOrder,
} from 'controllers/controller.orders';

const router = new Router();

router.route('/')
  .post(createNewOrder);

export default router;
