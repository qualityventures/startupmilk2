import { Router } from 'express';
import { loadProductInfo, loadOrderInfo } from 'helpers/middlewares';
import {
  downloadFile,
} from 'controllers/controller.download';

const router = new Router();

router.route('/:id/:file_id/:order_id')
  .get(loadProductInfo, loadOrderInfo, downloadFile);

router.route('/:id/:file_id')
  .get(loadProductInfo, downloadFile);

export default router;
