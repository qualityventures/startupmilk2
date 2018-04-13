import { Router } from 'express';
import { createNewProduct, getProduct, getProducts, updateProduct } from 'controllers/controller.products';
import { checkAdminAccess } from 'helpers/middlewares';

const router = new Router();

router.route('/')
  .get(getProducts);

router.route('/:id')
  .get(getProduct);

router.route('/')
  .post(checkAdminAccess, createNewProduct);

router.route('/:id')
  .patch(checkAdminAccess, updateProduct);

export default router;
