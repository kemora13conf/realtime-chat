import { Router } from 'express';
import Users from '../Models/Users.js';
import { findUserById, list, user } from '../Controllers/users.js';
import { answerObject } from '../Helpers/utils.js';


const router = Router();

router.param('id', findUserById);
router.get('/', list);
router.get('/:id', user);

export default router;