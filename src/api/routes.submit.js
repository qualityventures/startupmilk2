import { Router } from 'express';
import { submitForm, getSubmits } from 'controllers/controller.submit';

const router = new Router();

router.route('/')
  .post(submitForm);

router.route('/')
  .get(getSubmits);

export default router;
