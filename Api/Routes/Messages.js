import { Router } from 'express';
import { findSenderById, findReceiverById, getMessages, create } from '../Controllers/messages.js';
import { requireSingin } from '../Controllers/auth.js';


const router = Router();

router.param('senderId', findSenderById);
router.param('recieverId', findReceiverById);
router.get('/:recieverId', requireSingin, getMessages);
router.post('/:recieverId', requireSingin, create);

export default router;