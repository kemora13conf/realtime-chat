import { Router } from 'express';
import { conversations, findReceiverById, getMessages, new_message } from '../Controllers/conversations.js';
import { requireSingin } from '../Controllers/auth.js';


const router = Router();

router.param('recieverId', findReceiverById);

router.get('/', requireSingin, conversations)
router.get('/:recieverId/messages', requireSingin, getMessages);
router.post('/:recieverId/message', requireSingin, new_message);

export default router;