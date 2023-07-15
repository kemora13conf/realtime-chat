import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { answerObject, login, register } from '../Controllers/auth.js';
import upload from '../Controllers/multer-config.js';
import Users from '../Models/Users.js';

const authRouter = Router();

authRouter.post('/register', upload.single('image'), register);
authRouter.post('/login', login)
authRouter.get('/verifyToken', async (req, res)=>{
    try {
        const Authorization = req.headers.authorization;
        if (Authorization) {
            const token = Authorization.split(" ")[1];
            const secretKey = process.env.JWT_SECRET;

            const verificationResponse = jwt.verify(token, secretKey);
            const userId = verificationResponse._id;
            
            const foundUser = await Users.findOne({ _id: userId });
            foundUser.password = undefined;
            if (foundUser) {
                res.status(200).json(answerObject('success', 'User Found!', foundUser));
            } else {
                res.status(401).json(answerObject('error', "Wrong authentication token"));
            }
        } else {
            res.status(404).json(answerObject('error', "Authentication token missing"));
        }
    } catch (error) {
      res.status(401).json({
        error: "Wrong authentication token",
      });
    }
});

export default authRouter;