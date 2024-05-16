import { Router } from 'express';
import {
  findUserById,
  list,
  user,
  isUserOnline,
  userProfilePicture,
  updateProfilePicture,
  updateUserInformation,
  updateUserPassword,
} from "../Controllers/users.js";
import { requireSingin, validateEmail, validateUsername } from '../Controllers/auth.js';
import { upload } from '../Controllers/conversations.js';


const router = Router();

router.param('id', findUserById);
router.get('/', requireSingin, list);
router.get('/:id/status', requireSingin, isUserOnline);
router.get('/:id', requireSingin, user);

// get profile picture of any user
router.get('/:id/profile-picture', requireSingin, userProfilePicture);

/**
 * The following routes are for updating :
 * user profile picture, 
 * user information 
 * and user password
 * of the current user
 */
router.put("/profile-picture", requireSingin, upload.single("image"), updateProfilePicture);
router.put("/information", requireSingin, validateEmail, validateUsername, updateUserInformation);
router.put("/password", requireSingin, updateUserPassword);

export default router;