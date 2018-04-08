import { Router } from 'express';
import { authLogin, authRegister } from 'controllers/controller.auth';

const router = new Router();

router.route('/login')
  .post(authLogin);

router.route('/register')
  .post(authRegister);

export default router;
