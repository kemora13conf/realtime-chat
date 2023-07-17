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
async function setSocket (req, res){
    try {
        console.log('socket id: ', req.body.socketId)
        const user = await Users.findOneAndUpdate(
            { _id: req.user._id }, 
            {$set : { socket: `${req.body.socketId }`}}, 
            { new: true });
        res.status(200).json(answerObject('success', 'Socket updated', user));
    } catch (error) {
        console.log(error.message);
        res.status(500).json(answerObject('error', 'Something went wrong '+error.message))
    }
}
export { list, findUserById, user, setSocket }