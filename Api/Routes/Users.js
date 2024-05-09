import { Router } from 'express';
import {
  findUserById,
  list,
  user,
  isUserOnline,
} from "../Controllers/users.js";
import { requireSingin } from '../Controllers/auth.js';


const router = Router();

router.param('id', findUserById);
router.get('/', requireSingin, list);
router.get('/:id/status', requireSingin, isUserOnline);
router.get('/:id', requireSingin, user);

export default router;