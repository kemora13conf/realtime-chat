import { Router } from 'express';
import { findSenderById, findReceiverById, getMessages, create } from '../Controllers/messages.js';


const router = Router();

router.param('senderId', findSenderById);
router.param('recieverId', findReceiverById);
router.get('/:senderId/:recieverId', getMessages);
router.post('/:senderId/:recieverId', create);

export default router;