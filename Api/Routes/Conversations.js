import { Router } from 'express';
import { conversationById, conversations, findReceiverById, messages, new_message, new_message_image, new_message_files, upload } from '../Controllers/conversations.js';
import { requireSingin } from '../Controllers/auth.js';


const router = Router();

router.param('id', conversationById);
router.param('username', findReceiverById);

router.get('/', requireSingin, conversations)
router.get('/:username/messages', requireSingin, messages);
router.post('/:username/message', requireSingin, new_message);
router.post('/:username/message/image', requireSingin, upload.single('image'), new_message_image);
router.post('/:username/message/files', requireSingin, upload.array('files'), new_message_files);

export default router;