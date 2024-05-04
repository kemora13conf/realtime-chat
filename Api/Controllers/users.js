import Database from "../Database.js";
import OnlineUsers from "../Helpers/Online-user.js";
import { answerObject } from "../Helpers/utils.js";
import Users from "../Models/Users.js";

async function list (req, res) {
    const db = await Database.getInstance();
    // get all the users and return them
    try {
        const user = await Users.find({ _id: { $ne: req.user._id } });
        res.status(200).json(answerObject('success', 'Users found', user));
    } catch (error) {
        res.status(500).json(answerObject('error', error.message));
    }
}

const onlineOnly = async (req, res) => {
    try {
        const db = await Database.getInstance();
        let users = OnlineUsers.getUsers()
        let usersIds = users.map(user => user.userId);
        let online_users = await Users.find({ _id: { $in: usersIds } });
        online_users = online_users.map(user => {
            return {
              ...user._doc,
              socket_id: users.find((u) => u.userId === String(user._id))
                ?.socketId,
              online: true,
            };
        });
        console.log(users, online_users)
        res
          .status(200)
          .json(answerObject("success", "Users found", online_users));
    } catch (error) {
        res.status(500).json(answerObject('error', error.message));
    }
}


async function findUserById (req, res, next, id){
    const db = await Database.getInstance();
    const user = await Users.findById({ _id: id });
    if (user) {
        req.userById = user;
        next();
    }
}
function user (req, res){
    res.status(200).json(answerObject('success', 'User found', req.userById));
}
async function setSocket (req, res){
    const db = await Database.getInstance();
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
export { list, findUserById, user, setSocket, onlineOnly }