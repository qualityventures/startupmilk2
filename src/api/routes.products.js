import { Router } from 'express';
import { checkAdminAccess, loadProductInfo } from 'helpers/middlewares';
import {
  createNewProduct,
  getProductByUrl,
  getProductById,
  getProducts,
  updateProduct,
  addProductImage,
} from 'controllers/controller.products';

const router = new Router();

router.route('/')
  .get(getProducts);

router.route('/getByUrl/:url')
  .get(getProductByUrl);

router.route('/getById/:id')
  .get(checkAdminAccess, loadProductInfo, getProductById);

router.route('/:id/images/')
  .post(checkAdminAccess, loadProductInfo, addProductImage);

router.route('/')
  .post(checkAdminAccess, createNewProduct);

router.route('/:id')
  .patch(checkAdminAccess, updateProduct);

export default router;
