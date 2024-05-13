import Database from "../Database.js";
import {
  GetConversationByParticipantsOrCreateOne,
  SerializeMessageContent,
  SerializeUser,
  answerObject,
} from "../Helpers/utils.js";
import Conversations from "../Models/Conversations.js";
import Messages, { MESSAGE_STATUS, MESSAGE_TYPES } from "../Models/Messages.js";
import Users from "../Models/Users.js";
import { ObjectId } from "mongodb";
import { io } from "../server.js";
import { __dirname } from "../App.js";
import multer from "multer";
import MessageContent from "../Models/MessageContent.js";
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
 * @param {NextFunction} next
 * @param {ObjectId} id
 * @returns NotFoundError | InternalServerError
 */
export const fileById = async (req, res, next, id) => {
  try {
    await Database.getInstance();
    let file = await MessageContent.findById(id);
    if (!file) {
      return res.status(404).json(answerObject("error", "file not found"));
    }
    req.file = file;
    next();
  } catch (err) {
    Logger.error(err);
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

export const get_file = async (req, res) => {
  try {
    const { file } = req;
    res.setHeader("Content-Type", file.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.fileName}`
    );
    res.send(file.message);
  } catch (err) {
    Logger.error(err);
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
      .limit(limit);
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
        io.to(String(message.sender._id)).emit("message-delivered", message);
      }
    }

    conversations = conversations.map((conversation) => {
      /**
       * Here we need to decode the message content
       * because the message content is stored as a buffer
       */
      return {
        ...conversation._doc,
        startedBy: SerializeUser(conversation.startedBy),
        to: SerializeUser(conversation.to),
        last_message:
          conversation.last_message != null
            ? SerializeMessageContent(conversation.last_message)
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
    let conversation = await GetConversationByParticipantsOrCreateOne({
      current_user: req.current_user,
      user: req.receiver,
    });

    /**
     * Here we need to do reversed pagination
     */
    let messages = await Messages.find({ conversation: conversation._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    let totalDocs = await Messages.countDocuments({
      conversation: conversation._id,
    });
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
      io.to(message.sender._id.toString()).emit(
        "message-seen",
        SerializeMessageContent(message)
      );
      io.to(message.receiver._id.toString()).emit(
        "message-seen",
        SerializeMessageContent(message)
      );
    }

    // decode Messages content
    messages = messages.map((message) => {
      if (
        message.type === MESSAGE_TYPES.FILE ||
        message.type === MESSAGE_TYPES.IMAGE ||
        message.type === MESSAGE_TYPES.TEXT
      ) {
        /**
         * Here we need to decode the message content
         * because the message content is stored as a buffer
         */
        return SerializeMessageContent(message);
      }
      return message;
    });
    return res.status(200).json(
      answerObject("success", "Messages fetched successfully", {
        messages,
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
    await Database.getInstance(); // Ensure the database is connected
    /**
     * We need first to get the conversation between the two users
     * or create a new one if it doesn't exist
     */
    const { current_user, receiver } = req;
    let conversation = await GetConversationByParticipantsOrCreateOne({
      current_user,
      user: receiver,
    });

    /**
     * Now we can save the message and update the last_message field
     */
    const { text } = req.body; // get the message text from the request body

    // create a new message content
    const messageContent = await MessageContent.create({
      message: Buffer.from(text, "utf-8"),
      contentType: "text/plain",
    });

    // create a new message
    const message = new Messages({
      sender: current_user._id,
      receiver: receiver._id,
      conversation: conversation._id,
      content: messageContent._id,
    });
    await message.save();

    // Update the last_message field in the conversation
    conversation.last_message = message._id;
    await conversation.save();

    // Emit the new message to the receiver
    io.to(receiver._id.toString()).emit(
      "new-message",
      SerializeMessageContent(message)
    );

    return res
      .status(200)
      .json(
        answerObject(
          "success",
          "Message sent successfully",
          SerializeMessageContent(message)
        )
      );
  } catch (err) {
    console.log(err);
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};

/**
 * Initialize the multer storage engine
 * to store the files in memory
 */
const storage = multer.memoryStorage(); // store the files in memory
export const upload = multer({ storage: storage }); // initialize the multer

/**
 * @function generateFilename
 * @param {String} originalname
 * @returns {String} Generated filename `RealTimeChat-timestamps.extension`
 */
export function generateFilename(originalname) {
  let arrName = originalname.split(".");
  let extension = arrName[arrName.length - 1];
  let timestamps = new Date();
  let generatedName = `RealTimeChat-${timestamps}.${extension}`;
  return generatedName;
}

/**
 * Send a new message of type image
 * @param {Request} req
 * @param {Response} res
 * @returns HttpResponse with Message | InternalServerError
 */
export const new_message_image = async (req, res) => {
  try {
    await Database.getInstance(); // Ensure the database is connected
    /**
     * We need first to get the conversation between the two users
     * or create a new one if it doesn't exist
     */
    const { current_user, receiver } = req;

    /**
     * We need first to get the conversation between the two users
     * or create a new one if it doesn't exist
     */
    let conversation = await GetConversationByParticipantsOrCreateOne({
      current_user,
      user: receiver,
    });

    const { file } = req; // get the image file from the request

    // create a new message content
    const messageContent = await MessageContent.create({
      message: file.buffer,
      contentType: file.mimetype,
      fileName: generateFilename(file.originalname),
      fileSize: file.size,
    });

    // create a new message
    const message = new Messages({
      sender: req.current_user._id,
      receiver: receiver._id,
      conversation: conversation._id,
      type: "IMAGE",
      content: [messageContent._id],
    });
    await message.save();

    // Update the last_message field in the conversation
    conversation.last_message = message._id;
    await conversation.save();

    // Emit the new message to the receiver
    io.to(receiver._id.toString()).emit(
      "new-message",
      SerializeMessageContent(message)
    );
    // Emit the new message to the sender
    io.to(req.current_user._id.toString()).emit(
      "new-message",
      SerializeMessageContent(message)
    );
    return res
      .status(200)
      .json(
        answerObject(
          "success",
          "Message sent successfully",
          SerializeMessageContent(message)
        )
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
    let conversation = await GetConversationByParticipantsOrCreateOne({
      current_user,
      user: receiver,
    });

    const { files } = req; // get the files from the request

    /**
     * Create a new message content for each file
     * and save the file in the database
     */
    let filesIds = []; // store the ids of each MessageContent
    for (let file of files) {
      const fileContent = await MessageContent.create({
        message: file.buffer,
        contentType: file.mimetype,
        fileName: generateFilename(file.originalname),
        fileSize: file.size,
      });
      filesIds.push(fileContent._id);
    }

    // create a new message
    const message = new Messages({
      sender: sender._id,
      receiver: receiver._id,
      conversation: conversation._id,
      type: "FILE",
      content: filesIds,
    });
    await message.save();

    // Update the last_message field in the conversation
    conversation.last_message = message._id;
    await conversation.save();

    // Emit the new message to the receiver
    io.to(receiver._id.toString()).emit(
      "new-message",
      SerializeMessageContent(message)
    );
    // Emit the new message to the sender
    io.to(sender._id.toString()).emit(
      "new-message",
      SerializeMessageContent(message)
    );
    return res
      .status(200)
      .json(
        answerObject(
          "success",
          "Message sent successfully",
          SerializeMessageContent(message)
        )
      );
  } catch (err) {
    return res.status(500).json(answerObject("error", "Internal server error"));
  }
};
