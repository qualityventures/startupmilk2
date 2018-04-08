import { Router } from 'express';
import { userGetInfo } from 'controllers/controller.user';

const router = new Router();

router.route('/')
  .get(userGetInfo);

export default router;
