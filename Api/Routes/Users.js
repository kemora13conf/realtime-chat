import { Router } from 'express';
import {
  findUserById,
  list,
  setSocket,
  user,
  isUserOnline,
} from "../Controllers/users.js";
import { requireSingin } from '../Controllers/auth.js';


const router = Router();

router.param('id', findUserById);
router.get('/', requireSingin, list);
router.get('/:id/status', requireSingin, isUserOnline);
router.get('/:id', requireSingin, user);
router.post('/set-socket', requireSingin, setSocket)

export default router;