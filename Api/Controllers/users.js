import Database from "../Database.js";
import OnlineUsers from "../Helpers/Online-user.js";
import { answerObject } from "../Helpers/utils.js";
import Users from "../Models/Users.js";

async function list(req, res) {
  await Database.getInstance();
  // get all the users and return them
  try {
    const users = await Users.find({ _id: { $ne: req.current_user._id } });
    res.status(200).json(answerObject("success", "Users found", users));
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
}

export const isUserOnline = async (req, res) => {
  try {
    await Database.getInstance();
    const { user } = req;
    const online = OnlineUsers.isOnline(String(user._id));
    res.status(200).json(answerObject("success", "User found", { online }));
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
};

async function findUserById(req, res, next, id) {
  await Database.getInstance();
  const user = await Users.findById({ _id: id });
  if (user) {
    req.user = user;
    next();
  }
}
function  user(req, res) {
  res.status(200).json(answerObject("success", "User found", req.user));
}
async function setSocket(req, res) {
  await Database.getInstance();
  try {
    console.log("socket id: ", req.body.socketId);
    const user = await Users.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { socket: `${req.body.socketId}` } },
      { new: true }
    );
    res.status(200).json(answerObject("success", "Socket updated", user));
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json(answerObject("error", "Something went wrong " + error.message));
  }
}
export { list, findUserById, user, setSocket };
