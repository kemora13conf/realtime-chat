import Database from "../Database.js";
import { answerObject } from "../Helpers/utils.js";
import Messages from "../Models/Messages.js";
import Users from "../Models/Users.js";
import { ObjectId } from "mongodb";

export const conversations = async (req, res) => {
  await Database.getInstance();
  try {
    const { current_user } = req;
    const userId = new ObjectId(current_user._id);
    const messages = await Messages.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "username last_seen profile-picture");

    // Group conversations by other participant
    const conversations = {};
    messages.forEach((message) => {
      const otherUserId = message.sender._id.equals(userId)
        ? message.receiver._id
        : message.sender._id;

      // Initialize conversation if it doesn't exist
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          participant: message.sender._id.equals(userId)
            ? message.receiver
            : message.sender,
          messages: [],
        };
      }
      // Add message to the conversation
      conversations[otherUserId].messages.push(message);
    });
    return res
      .status(200)
      .json(
        answerObject(
          "success",
          "Conversations fetched successfully",
          Object.values(conversations)
        )
      );
  } catch (err) {
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

export const findReceiverById = async (req, res, next, id) => {
  await Database.getInstance();
  try {
    const receiver = await Users.findById({ _id: id });
    if (!receiver) {
      return res.status(400).json(answerObject("error", "reciever not found"));
    }
    req.receiver = receiver;
    next();
  } catch (err) {
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

export const getMessages = async (req, res) => {
  await Database.getInstance();
  try {
    const { current_user, receiver } = req;
    // console.log('one :' ,user, receiver)

    const userId = new ObjectId(current_user._id);
    const receiverId = new ObjectId(receiver._id);
    const messages = await Messages.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    });
    return res
      .status(200)
      .json(answerObject("success", "Messages fetched successfully", messages));
  } catch (err) {
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

export const new_message = async (req, res) => {
  await Database.getInstance();
  try {
    console.log(req.body);
    const { user, receiver } = req;
    let message = await Messages.create(req.body);
    message = await Messages.findOne({ _id: message._id });
    return res
      .status(200)
      .json(answerObject("success", "Message created successfully", message));
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(answerObject("error", "Internal server error " + err.message));
  }
};
