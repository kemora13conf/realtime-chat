import Database from "../Database.js";
import { answerObject } from "../Helpers/utils.js";
import Conversations from "../Models/Conversations.js";
import Messages, { MESSAGE_STATUS } from "../Models/Messages.js";
import Users from "../Models/Users.js";
import { ObjectId } from "mongodb";
import { io } from "../server.js";
import fs from "fs";
import path from "path";
import { __dirname } from "../App.js";
import multer from "multer";
import Logger from "../Helpers/Logger.js";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {ObjectId} id
 * @returns NotFoundError | InternalServerError
 */
export const conversationById = async (req, res, next, id) => {
  try {
    await Database.getInstance();
    let conversation = await Conversations.findById(id)
      .populate("to startedBy", "username last_seen profile-picture")
      .populate("last_message");
    if (!conversation) {
      // create a new conversation
      const { current_user, receiver } = req;
      conversation = new Conversations({
        startedBy: current_user._id,
        to: receiver._id,
      });
      await conversation.save();
    }
    req.conversation = conversation;
    next();
  } catch (err) {
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {ObjectId} id id of the receiver
 * @returns NotFoundError | InternalServerError
 */
export const findReceiverById = async (req, res, next, id) => {
  try {
    await Database.getInstance();
    let receiver = null;
    try {
      const userId = new ObjectId(id);
      receiver = await Users.findOne({ _id: userId });
    } catch (error) {
      receiver = await Users.findOne({ username: id });
    }
    if (!receiver) {
      return res.status(400).json(answerObject("error", "reciever not found"));
    }
    req.receiver = receiver;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns HttpErrorResponse with Conversations[] | InternalServerError
 */
export const conversations = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    await Database.getInstance();
    const { current_user } = req;
    const userId = new ObjectId(current_user._id);
    const conversations = await Conversations.find({
      $or: [{ startedBy: userId }, { to: userId }],
    })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("to startedBy", "username last_seen profile-picture")
      .populate({
        path: "last_message",
        populate: {
          path: "sender receiver",
          select: "username profile-picture",
        },
      });
    const totalDocs = await Conversations.countDocuments({
      $or: [{ startedBy: userId }, { to: userId }],
    });

    /**
     * loading these conversation mean the current user 
     * is received the messages in those conversations
     * but he didn't see them yet. So we gonna change the 
     * status of the messages to SEEN
     */
    for (let conversation of conversations) {
      const messages = await Messages.find({
        conversation: conversation._id,
        receiver: userId,
        status: MESSAGE_STATUS.SENT,
      });
      for (let message of messages) {
        message.status = MESSAGE_STATUS.DELIVERED;
        await message.save();
        await message.populate("sender", "username profile-picture");
        await message.populate("receiver", "username profile-picture");
        io.to(String(message.sender._id)).emit("message-delivered", message);
      }
    }

    return res.status(200).json(
      answerObject("success", "Conversations fetched successfully", {
        conversations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalDocs / limit),
          total: totalDocs,
        },
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns HttpResponse with Messages[] | InternalServerError
 */
export const messages = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    await Database.getInstance();
    let conversation = await Conversations.findOne({
      $or: [
        { startedBy: req.current_user._id, to: req.receiver._id },
        { startedBy: req.receiver._id, to: req.current_user._id },
      ],
    })
      .populate("to startedBy", "username last_seen profile-picture")
      .populate("last_message");
    if (!conversation) {
      // create a new conversation
      conversation = new Conversations({
        startedBy: req.current_user._id,
        to: req.receiver._id,
      });
      await conversation.save();
      await conversation.populate(
        "to startedBy",
        "username last_seen profile-picture"
      );
    }
    /**
     * Here we need to do reversed pagination
     */
    let messages = await Messages.find({ conversation: conversation._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "username profile-picture")
      .populate("receiver", "username profile-picture");
    messages = messages.reverse();

    /**
     * Here we need to make all the received messages as seen
     */
    await Messages.updateMany(
      { conversation: conversation._id, receiver: req.current_user._id },
      { status: "SEEN" }
    );
    io.to(req.receiver._id.toString()).emit("messages-seen", conversation._id);
    return res
      .status(200)
      .json(answerObject("success", "Messages fetched successfully", messages));
  } catch (err) {
    console.log(err);
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

/**
 * Send a new message of type text
 * @param {Request} req
 * @param {Response} res
 * @returns HttpResponse with Message | InternalServerError
 */
export const new_message = async (req, res) => {
  try {
    await Database.getInstance();

    /**
     * We need first to get the conversation between the two users
     * or create a new one if it doesn't exist
     */
    const { current_user, receiver } = req;
    let conversation = await Conversations.findOne({
      $or: [
        { startedBy: current_user._id, to: receiver._id },
        { startedBy: receiver._id, to: current_user._id },
      ],
    });
    if (!conversation) {
      // create a new conversation
      conversation = new Conversations({
        startedBy: req.current_user._id,
        to: req.receiver._id,
      });
      await conversation.save();
      await conversation.populate(
        "to startedBy",
        "username last_seen profile-picture"
      );
    }

    /**
     * Now we can save the message and update the last_message field
     */
    const { text } = req.body;
    const message = new Messages({
      sender: current_user._id,
      receiver: receiver._id,
      conversation: conversation._id,
      text,
    });
    await message.save();
    await message.populate("sender", "username profile-picture");
    await message.populate("receiver", "username profile-picture");
    conversation.last_message = message._id;
    await conversation.save();

    io.to(receiver._id.toString()).emit("new-message", message);
    io.to(current_user._id.toString()).emit("new-message", message);
    return res
      .status(200)
      .json(answerObject("success", "Message sent successfully", message));
  } catch (err) {
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

function generateFileName(originalname) {
  let arrName = originalname.split(".");
  let salt = Math.random().toString(36).substring(7);
  let extension = arrName[arrName.length - 1];
  let nameWithoutExtension = arrName.slice(0, arrName.length - 1).join(".");
  let saveAs = `${nameWithoutExtension}-${salt}.${extension}`;
  return saveAs;
}

function saveFile(file, name, location) {
  let saveAs = generateFileName(name);
  let filePath = path.join(__dirname, location, saveAs);
  fs.writeFileSync(filePath, file);
  return saveAs;
}

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

/**
 * Send a new message of type image
 * @param {Request} req
 * @param {Response} res
 * @returns HttpResponse with Message | InternalServerError
 */
export const new_message_image = async (req, res) => {
  try {
    await Database.getInstance();
    /**
     * We need first to get the conversation between the two users
     * or create a new one if it doesn't exist
     */
    const { current_user, receiver } = req;
    let conversation = await Conversations.findOne({
      $or: [
        { startedBy: current_user._id, to: receiver._id },
        { startedBy: receiver._id, to: current_user._id },
      ],
    });
    if (!conversation) {
      // create a new conversation
      conversation = new Conversations({
        startedBy: req.current_user._id,
        to: req.receiver._id,
      });
      await conversation.save();
      await conversation.populate(
        "to startedBy",
        "username last_seen profile-picture"
      );
    }

    const { file } = req;
    const sender = req.current_user;
    const imageName = saveFile(
      file.buffer,
      file.originalname,
      "./Assets/Messages-files"
    );
    const message = new Messages({
      sender: sender._id,
      receiver: receiver._id,
      conversation: conversation._id,
      type: "IMAGE",
      image: imageName,
    });
    await message.save();
    await message.populate("sender", "username profile-picture");
    await message.populate("receiver", "username profile-picture");
    conversation.last_message = message._id;
    await conversation.save();

    io.to(receiver._id.toString()).emit("new-message", message);
    io.to(sender._id.toString()).emit("new-message", message);
    return res
      .status(200)
      .json(answerObject("success", "Message sent successfully", message));
  } catch (err) {
    console.log(err);
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

/**
 * Send a new message of type files
 * @param {Request} req
 * @param {Response} res
 * @returns HttpResponse with Message | InternalServerError
 */
export const new_message_files = async (req, res) => {
  try {
    await Database.getInstance();
    /**
     * We need first to get the conversation between the two users
     * or create a new one if it doesn't exist
     */
    const { current_user, receiver } = req;
    let conversation = await Conversations.findOne({
      $or: [
        { startedBy: current_user._id, to: receiver._id },
        { startedBy: receiver._id, to: current_user._id },
      ],
    });
    if (!conversation) {
      // create a new conversation
      conversation = new Conversations({
        startedBy: req.current_user._id,
        to: req.receiver._id,
      });
      await conversation.save();
      await conversation.populate(
        "to startedBy",
        "username last_seen profile-picture"
      );
    }

    const { files } = req;
    const sender = req.current_user;
    let fileNames = [];
    for (let file of files) {
      let fileName = saveFile(
        file.buffer,
        file.originalname,
        "./Assets/Messages-files"
      );
      fileNames.push(fileName);
    }
    const message = new Messages({
      sender: sender._id,
      receiver: receiver._id,
      conversation: conversation._id,
      type: "FILE",
      files: fileNames,
    });
    await message.save();
    await message.populate("sender", "username profile-picture");
    await message.populate("receiver", "username profile-picture");
    conversation.last_message = message._id;
    await conversation.save();

    io.to(receiver._id.toString()).emit("new-message", message);
    io.to(sender._id.toString()).emit("new-message", message);
    return res
      .status(200)
      .json(answerObject("success", "Message sent successfully", message));
  } catch (err) {
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};
