import { Router } from 'express';
import { findUserById, list, setSocket, user, onlineOnly } from '../Controllers/users.js';
import { requireSingin } from '../Controllers/auth.js';


const router = Router();

router.param('id', findUserById);
router.get('/', requireSingin, list);
router.get('/online', requireSingin, onlineOnly);
router.get('/:id', requireSingin, user);
router.post('/set-socket', requireSingin, setSocket)

export default router;