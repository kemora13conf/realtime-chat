import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { login, register, requireSingin } from '../Controllers/auth.js';
import { answerObject } from "../Helpers/utils.js";
import upload from '../Controllers/multer-config.js';

const authRouter = Router();

authRouter.post('/register', upload.single('image'), register);
authRouter.post('/login', login)
authRouter.get('/verifyToken', requireSingin, (req, res) => {
    res.status(200).json(answerObject('success', 'User Found!', req.user));
});

export default authRouter;