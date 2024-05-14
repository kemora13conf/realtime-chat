import { Router } from 'express';
import {
  findUserById,
  list,
  user,
  isUserOnline,
  userProfilePicture,
} from "../Controllers/users.js";
import { requireSingin } from '../Controllers/auth.js';


const router = Router();

router.param('id', findUserById);
router.get('/', requireSingin, list);
router.get('/:id/status', requireSingin, isUserOnline);
router.get('/:id', requireSingin, user);
router.get('/:id/profile-picture', requireSingin, userProfilePicture);

export default router;