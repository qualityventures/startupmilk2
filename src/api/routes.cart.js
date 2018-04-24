import { Router } from 'express';
import { loadProductInfo } from 'helpers/middlewares';
import {
  cartAddProduct,
  cartRemoveProduct,
} from 'controllers/controller.cart';

const router = new Router();

router.route('/add/:id')
  .get(loadProductInfo, cartAddProduct);

router.route('/remove/:id')
  .get(loadProductInfo, cartRemoveProduct);

export default router;
