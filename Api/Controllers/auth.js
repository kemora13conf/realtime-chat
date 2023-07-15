import Users from "../Models/Users.js";
import jwt from 'jsonwebtoken'

const answerObject = (type, message, data=null) => {
    return {
        type: type,
        message: message,
        data: data,
    };
};

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

export { answerObject, register, login }