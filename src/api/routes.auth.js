import { Router } from 'express';
import { authLogin, authRecover } from 'controllers/controller.auth';

const router = new Router();

router.route('/login')
  .post(authLogin);

router.route('/recover')
  .post(authRecover);

export default router;
