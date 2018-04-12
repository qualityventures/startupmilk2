import { Router } from 'express';
import { createNewProduct } from 'controllers/controller.products';
import { verifyToken } from 'helpers/middlewares';

const router = new Router();

router.route('/create')
  .post(verifyToken, createNewProduct);

export default router;
