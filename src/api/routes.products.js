import { Router } from 'express';
import { createNewProduct, getProduct, updateProduct } from 'controllers/controller.products';
import { checkAdminAccess } from 'helpers/middlewares';

const router = new Router();

router.route('/')
  .post(checkAdminAccess, createNewProduct);

router.route('/:id')
  .get(checkAdminAccess, getProduct);

router.route('/:id')
  .patch(checkAdminAccess, updateProduct);

export default router;
