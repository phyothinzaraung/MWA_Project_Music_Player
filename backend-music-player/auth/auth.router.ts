import { Router } from 'express';
import { change_password, sign_in, sign_up } from './auth.controller';

const router = Router();

router.post('/signup', sign_up);
router.post('/signin', sign_in);
router.put('/password', change_password);

export default router;