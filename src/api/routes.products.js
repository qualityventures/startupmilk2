import { Router } from 'express';
import { createNewProduct } from 'controllers/controller.products';
import { checkAdminAccess } from 'helpers/middlewares';

const router = new Router();

router.route('/create')
  .post(checkAdminAccess, createNewProduct);

export default router;
