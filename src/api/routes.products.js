import { Router } from 'express';
import { checkAdminAccess } from 'helpers/middlewares';
import {
  createNewProduct,
  getProductByUrl,
  getProductById,
  getProducts,
  updateProduct,
} from 'controllers/controller.products';

const router = new Router();

router.route('/')
  .get(getProducts);

router.route('/getByUrl/:url')
  .get(getProductByUrl);

router.route('/getById/:id')
  .get(checkAdminAccess, getProductById);

router.route('/')
  .post(checkAdminAccess, createNewProduct);

router.route('/:id')
  .patch(checkAdminAccess, updateProduct);

export default router;
