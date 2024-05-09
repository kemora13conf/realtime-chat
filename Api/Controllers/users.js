import Database from "../Database.js";
import Logger from "../Helpers/Logger.js";
import { answerObject } from "../Helpers/utils.js";
import Users from "../Models/Users.js";
import { io } from "../server.js";

export async function list(req, res) {
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
    const online = io.sockets.adapter.rooms.get(String(user._id)) ? true : false;
    res.status(200).json(answerObject("success", "User found", { online }));
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
};

export async function findUserById(req, res, next, id) {
  try {
    await Database.getInstance();
    let user = null;
    try {
      user = await Users.findOne({ _id: id });
    } catch (error) {
      user = await Users.findOne({ username: id });
    }
    if (user != null) {
      req.user = user;
      req.user.hashed_password = undefined;
      req.user.salt = undefined;
      next();
    } else {
      res.status(404).json(answerObject("error", "User not found"));
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(answerObject("error", error.message));
  }
}
export function user(req, res) {
  try {
    res.status(200).json(answerObject("success", "User found", req.user));
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
}

