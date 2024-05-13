import { Router } from "express";
import {
  conversationById,
  conversations,
  findReceiverById,
  messages,
  new_message,
  new_message_image,
  new_message_files,
  upload,
  unread_messages,
  fileById,
  get_file,
} from "../Controllers/conversations.js";
import { requireSingin } from "../Controllers/auth.js";

const router = Router();

router.param("id", conversationById);
router.param("username", findReceiverById);
router.param("fileId", fileById);

router.get("/", requireSingin, conversations); // Route to get all the conversations of the current user
router.get("/:username/messages", requireSingin, messages); // Route to get the messages of a conversation
router.get("/:id/unread", requireSingin, unread_messages); // Route to get the unread messages
router.get("/Messages-files/:fileId", requireSingin, get_file); // Route to download the file of a message

router.post("/:username/message", requireSingin, new_message); // Route to send a new text message
router.post(
  "/:username/message/image",
  requireSingin,
  upload.single("image"),
  new_message_image
); // Route to send a new image message
router.post(
  "/:username/message/files",
  requireSingin,
  upload.array("files"),
  new_message_files
); // Route to send a new files message

export default router;
