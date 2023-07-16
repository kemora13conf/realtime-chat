import Users from "../Models/Users.js";
import jwt from 'jsonwebtoken';
import { answerObject } from "../Helpers/utils.js";

const register = async (req, res) => {
    if(
        !req.body.username ||
        !req.body.email ||
        !req.body.password ||
        !req.body.passwordConfirmation
    ) {
        return res.status(400).json(answerObject('error', 'Please fill in all fields'));
    }
    if(req.body.password !== req.body.passwordConfirmation) {
        return res.status(400).json(answerObject('error', 'Passwords do not match'));
    }

    try {
        const user = await Users.create(req.body);
        user.save();
        return res.status(201).json(answerObject('success', 'User created successfully', user));
    }catch(error) {
        return res.status(500).json(answerObject('error', error.message));
    }
};

const login = async (req, res) => {
    try {
        const user = await Users.findOne({ username: req.body.username })
        if(!user){
            return res.status(404).json(answerObject('username', `No user with this username: ${req.body.username}`))
        }
        if(user.decryptPassword() != req.body.password){
            return res.status(404).json(answerObject('password', `Wrong password!`))
        }
        const token = jwt.sign({_id: user._id }, process.env.JWT_SECRET)
        return res.status(200).json(answerObject('success', `Logged in successefully!`, token))
    } catch (error) {
        return res.status(500).json(answerObject('error', 'Something went wrong!'))
    }   
}

async function requireSingin(req, res, next) {
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
                req.user = foundUser;
                next();
            } else {
                res.status(401).json(answerObject('error', "Wrong authentication token"));
            }
        } else {
            res.status(404).json(answerObject('error', "Authentication token missing"));
        }
    } catch (error) {
        console.log(error.message)
      res.status(401).json({
        error: "Wrong authentication token",
      });
    }
}

export { register, login, requireSingin }