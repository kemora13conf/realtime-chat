import { Router } from 'express';
import { findUserById, list, setSocket, user } from '../Controllers/users.js';
import { requireSingin } from '../Controllers/auth.js';


const router = Router();

router.param('id', findUserById);
router.get('/', list);
router.get('/:id', user);
router.post('/set-socket', requireSingin, setSocket)

export default router;