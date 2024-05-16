import Database from "../Database.js";
import Logger from "../Helpers/Logger.js";
import {
  getConversationByParticipantsOrCreateOne,
  SerializeUser,
  answerObject,
} from "../Helpers/utils.js";
import Users from "../Models/Users.js";
import { io } from "../server.js";

/**
 * @function list - Controller to list all users with pagination
 * @param {Request} req
 * @param {Response} res
 */
export async function list(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    await Database.getInstance();
    let users = await Users.find({ _id: { $ne: req.current_user._id } })
      .select("username profile-picture last_seen")
      .skip(skip)
      .limit(limit)
      .sort({ last_seen: -1 });
    const totalDocs = await Users.countDocuments({
      _id: { $ne: req.current_user._id },
    });
    users = users.map((user) => {
      return SerializeUser(user);
    });
    res.status(200).json(
      answerObject("success", "Users found", {
        users,
        pagination: {
          page,
          limit,
          pages: Math.ceil(totalDocs / limit),
          total: totalDocs,
        },
      })
    );
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
}

export const isUserOnline = async (req, res) => {
  try {
    await Database.getInstance();
    const { user } = req;
    const online = io.sockets.adapter.rooms.get(String(user._id))
      ? true
      : false;
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
    res.status(500).json(answerObject("error", error.message));
  }
}

/**
 * Controller to get the user
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} response with answerObject
 */
export async function user(req, res) {
  try {
    /**
     * Get the conversation between the current user and the user
     * If the conversation does not exist, create a new conversation
     */
    let conversation;
    try {
      conversation = await getConversationByParticipantsOrCreateOne({
        current_user: req.current_user,
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json(answerObject("error", error.message));
    }

    req.user = {
      ...SerializeUser(req.user),
      conversation: {
        ...conversation._doc,
        startedBy: SerializeUser(conversation.startedBy),
        to: SerializeUser(conversation.to),
      },
    };
    res.status(200).json(answerObject("success", "User found", req.user));
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
}

/**
 * @function userProfilePicture
 * @description Controller to get the profile picture of the user
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} response with answerObject
 */
export const userProfilePicture = async (req, res) => {
  try {
    await Database.getInstance();
    const user = await Users.findOne({ _id: req.user._id }).select(
      "profile-picture"
    );
    if (user["profile-picture"].data) {
      res.set("Content-Type", user["profile-picture"].contentType);
      return res.send(user["profile-picture"].data);
    } else {
      res.status(404).json(answerObject("error", "Profile picture not found"));
    }
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
};

/**
 * @function updateProfilePicture
 * @description Controller to update the profile picture of the user
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} response with answerObject
 */
export const updateProfilePicture = async (req, res) => {
  try {
    const { current_user, file } = req;
    if (!file) {
      return res
        .status(200)
        .json(answerObject("image", "Please upload an image"));
    } else {
      const { mimetype, size } = file;
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 1024 * 1024 * 2; // 2MB

      // Check if file is an image and size is within limit
      if (!allowedTypes.includes(mimetype)) {
        return res
          .status(200)
          .json(answerObject("image", "Only images are allowed"));
      } else if (size > maxSize) {
        return res
          .status(200)
          .json(answerObject("image", "Image size should not exceed 2MB"));
      }
    }
    await Database.getInstance();
    const user = await Users.findOne({ _id: current_user._id }).select(
      "profile-picture"
    );
    user["profile-picture"] = {
      data: file.buffer,
      contentType: file.mimetype,
      fileName: file.originalname,
    };
    await user.save();
    res.status(200).json(answerObject("success", "Profile picture updated"));
  } catch (error) {
    console.log(error);
    res.status(500).json(answerObject("error", error.message));
  }
};

/**
 * @function updateUserInformation
 * @description Controller to update the user information
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} response with answerObject
 */
export const updateUserInformation = async (req, res) => {
  try {
    const { current_user } = req;
    await Database.getInstance();
    const user = await Users.findOne({ _id: current_user._id });
    user.username = req.body.username;
    user.email = req.body.email;
    await user.save();
    res.status(200).json(answerObject("success", "User updated successfully"));
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
};

/**
 * @function updatePassword
 * @description Controller to update the user password
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} response with answerObject
 */
export const updateUserPassword = async (req, res) => {
  try {
    await Database.getInstance();
    let { current_user } = req;
    const { current_password, new_password, confirm_password } = req.body;
    current_user = await Users.findOne({ _id: current_user._id })
      .select("hashed_password salt");
    
    if (!current_password) {
      return res
        .status(200)
        .json(answerObject("current_password", "Current password is required"));
    } else if (!current_user.isPasswordMatch(current_password)) {
      return res
        .status(200)
        .json(answerObject("current_password", "Incorrect password"));
    } else if (!new_password) {
      return res
        .status(200)
        .json(answerObject("new_password", "New password is required"));
    } else if (
      !new_password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ) {
      return res
        .status(200)
        .json(
          answerObject(
            "new_password",
            "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number"
          )
        );
    } else if (new_password !== confirm_password) {
      return res
        .status(200)
        .json(answerObject("confirm_password", "Passwords do not match"));
    }
    current_user.hashed_password = new_password;
    await current_user.save();
    res
      .status(200)
      .json(answerObject("success", "Password updated successfully"));
  } catch (error) {
    res.status(500).json(answerObject("error", error.message));
  }
};
