import Database from "../Database.js";
import {
  ConvertFileToBase64,
  DeSerializeTextMessage,
  answerObject,
} from "../Helpers/utils.js";
import Conversations from "../Models/Conversations.js";
import Messages, { MESSAGE_STATUS, MESSAGE_TYPES } from "../Models/Messages.js";
import Users from "../Models/Users.js";
import { ObjectId } from "mongodb";
import { io } from "../server.js";
import fs from "fs";
import path from "path";
import { __dirname } from "../App.js";
import multer from "multer";
import Logger from "../Helpers/Logger.js";
import MessageContent from "../Models/MessageContent.js";

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
    let conversations = await Conversations.find({
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

    conversations = conversations.map((conversation) => {
      return {
        ...conversation._doc,
        last_message: conversation.last_message
          ? {
              ...conversation.last_message._doc,
              content: conversation.last_message.content.map((file) => {
                return {
                  _id: file._id,
                  message:
                    file.contentType === "text/plain"
                      ? DeSerializeTextMessage(file.message)
                      : ConvertFileToBase64(file.message),
                  fileName: file.fileName,
                  fileSize: file.fileSize,
                };
              }),
            }
          : null,
      };
    });

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
      .limit(limit);
    messages = messages.reverse();

    /**
     * Here we need to make all the received messages as seen
     */
    let unseenMessages = messages.filter(
      (message) =>
        message.receiver._id == req.current_user._id.toString() &&
        message.status != MESSAGE_STATUS.SEEN
    );
    for (let message of unseenMessages) {
      message.status = MESSAGE_STATUS.SEEN;
      await message.save();
      await message.populate("sender", "username profile-picture");
      await message.populate("receiver", "username profile-picture");
      await message.populate("content");
      io.to(message.sender._id.toString()).emit("message-seen", message);
      io.to(message.receiver._id.toString()).emit("message-seen", message);
    }

    // decode Messages content
    messages = messages.map((message) => {
      if (
        message.type === MESSAGE_TYPES.FILE ||
        message.type === MESSAGE_TYPES.IMAGE ||
        message.type === MESSAGE_TYPES.TEXT
      ) {
        return {
          ...message._doc,
          content: message.content.map((file) => {
            return {
              _id: file._id,
              message:
                file.contentType === "text/plain"
                  ? DeSerializeTextMessage(file.message)
                  : ConvertFileToBase64(file.message),
              fileName: file.fileName,
              fileSize: file.fileSize,
            };
          }),
        };
      }
      return message;
    });
    return res
      .status(200)
      .json(answerObject("success", "Messages fetched successfully", messages));
  } catch (err) {
    console.log(err);
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

/**
 * Get all the unread messages
 * @param {Request} req
 * @param {Response} res
 * @returns HttpResponse with Messages[] | InternalServerError
 */
export const unread_messages = async (req, res) => {
  try {
    await Database.getInstance();
    const { current_user } = req;
    const userId = new ObjectId(current_user._id);
    const messages = await Messages.countDocuments({
      receiver: userId,
      status: { $ne: MESSAGE_STATUS.SEEN },
    });
    return res
      .status(200)
      .json(
        answerObject(
          "success",
          "Unread messages fetched successfully",
          messages
        )
      );
  } catch (err) {
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
    const messageContent = await MessageContent.create({
      message: Buffer.from(text, "utf-8"),
      contentType: "text/plain",
    });
    const message = new Messages({
      sender: current_user._id,
      receiver: receiver._id,
      conversation: conversation._id,
      content: messageContent._id,
    });
    await message.save();
    await message.populate("content");
    conversation.last_message = message._id;
    await conversation.save();

    io.to(receiver._id.toString()).emit("new-message", {
      ...message._doc,
      content: message.content.map((file) => {
        return {
          _id: file._id,
          message:
            file.contentType === "text/plain"
              ? DeSerializeTextMessage(file.message)
              : ConvertFileToBase64(file.message),
          fileName: file.fileName,
          fileSize: file.fileSize,
        };
      }),
    });
    return res.status(200).json(
      answerObject("success", "Message sent successfully", {
        ...message._doc,
        content: message.content.map((file) => {
          return {
            _id: file._id,
            message:
              file.contentType === "text/plain"
                ? DeSerializeTextMessage(file.message)
                : ConvertFileToBase64(file.message),
            fileName: file.fileName,
            fileSize: file.fileSize,
          };
        }),
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
function getFilename(originalname) {
  let arrName = originalname.split(".");
  let extension = arrName[arrName.length - 1];
  let timestamps = new Date();
  let saveAs = `RealTimeChat-${timestamps}.${extension}`;
  return saveAs;
}

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
    const messageContent = await MessageContent.create({
      message: file.buffer,
      contentType: file.mimetype,
      fileName: getFilename(file.originalname),
      fileSize: file.size,
    });

    const message = new Messages({
      sender: sender._id,
      receiver: receiver._id,
      conversation: conversation._id,
      type: "IMAGE",
      content: [messageContent._id],
    });
    await message.save();
    await message.populate("sender", "username profile-picture");
    await message.populate("receiver", "username profile-picture");
    await message.populate("content");
    conversation.last_message = message._id;
    await conversation.save();

    io.to(receiver._id.toString()).emit("new-message", {
      ...message._doc,
      content: message.content.map((file) => {
        return {
          _id: file._id,
          message:
            file.contentType === "text/plain"
              ? DeSerializeTextMessage(file.message)
              : ConvertFileToBase64(file.message),
          fileName: file.fileName,
          fileSize: file.fileSize,
        };
      }),
    });
    io.to(sender._id.toString()).emit("new-message", {
      ...message._doc,
      content: message.content.map((file) => {
        return {
          _id: file._id,
          message:
            file.contentType === "text/plain"
              ? DeSerializeTextMessage(file.message)
              : ConvertFileToBase64(file.message),
          fileName: file.fileName,
          fileSize: file.fileSize,
        };
      }),
    });
    return res.status(200).json(
      answerObject("success", "Message sent successfully", {
        ...message._doc,
        content: message.content.map((file) => {
          return {
            _id: file._id,
            message:
              file.contentType === "text/plain"
                ? DeSerializeTextMessage(file.message)
                : ConvertFileToBase64(file.message),
            fileName: file.fileName,
            fileSize: file.fileSize,
          };
        }),
      })
    );
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
    let filesIds = [];
    for (let file of files) {
      const fileContent = await MessageContent.create({
        message: file.buffer,
        contentType: file.mimetype,
        fileName: getFilename(file.originalname),
        fileSize: file.size,
      });
      filesIds.push(fileContent._id);
    }
    const message = new Messages({
      sender: sender._id,
      receiver: receiver._id,
      conversation: conversation._id,
      type: "FILE",
      content: filesIds,
    });
    await message.save();
    await message.populate("sender", "username profile-picture");
    await message.populate("receiver", "username profile-picture");
    await message.populate("content");
    conversation.last_message = message._id;
    await conversation.save();

    io.to(receiver._id.toString()).emit("new-message", {
      ...message._doc,
      content: message.content.map((file) => {
        return {
          _id: file._id,
          message:
            file.contentType === "text/plain"
              ? DeSerializeTextMessage(file.message)
              : ConvertFileToBase64(file.message),
          fileName: file.fileName,
          fileSize: file.fileSize,
        };
      }),
    });
    io.to(sender._id.toString()).emit("new-message", {
      ...message._doc,
      content: message.content.map((file) => {
        return {
          _id: file._id,
          message:
            file.contentType === "text/plain"
              ? DeSerializeTextMessage(file.message)
              : ConvertFileToBase64(file.message),
          fileName: file.fileName,
          fileSize: file.fileSize,
        };
      }),
    });
    return res.status(200).json(
      answerObject("success", "Message sent successfully", {
        ...message._doc,
        content: message.content.map((file) => {
          return {
            _id: file._id,
            message:
              file.contentType === "text/plain"
                ? DeSerializeTextMessage(file.message)
                : ConvertFileToBase64(file.message),
            fileName: file.fileName,
            fileSize: file.fileSize,
          };
        }),
      })
    );
  } catch (err) {
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};
