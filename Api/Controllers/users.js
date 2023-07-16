import { answerObject } from "../Helpers/utils.js";
import Users from "../Models/Users.js";



async function list (req, res) {
    // get all the users and return them
    try {
        const user = await Users.find();
        res.status(200).json(answerObject('success', 'Users found', user));
    } catch (error) {
        res.status(500).json(answerObject('error', error.message));
    }
}


async function findUserById (req, res, next, id){
    const user = await Users.findById({ _id: id });
    if (user) {
        req.user = user;
        next();
    }
}
function user (req, res){
    res.status(200).json(answerObject('success', 'User found', req.user));
}
export { list, findUserById, user }