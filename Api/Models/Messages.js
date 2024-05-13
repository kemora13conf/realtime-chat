import mongoose from "mongoose";
import Logger from "../Helpers/Logger.js";

const { model, models, Schema } = mongoose;

export const MESSAGE_TYPES = {
  TEXT: "TEXT",
  FILE: "FILE",
  IMAGE: "IMAGE",
};

export const MESSAGE_STATUS = {
  SENT: "SENT",
  DELIVERED: "DELIVERED",
  SEEN: "SEEN",
};

const messagesSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversations",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(MESSAGE_TYPES),
      uppercase: true,
      trim: true,
      default: MESSAGE_TYPES.TEXT,
    },
    content: [
      {
        type: Schema.Types.ObjectId,
        ref: "MessageContent",
      },
    ],
    status: {
      type: String,
      enum: Object.values(MESSAGE_STATUS),
      default: MESSAGE_STATUS.SENT,
    },
  },
  {
    timestamps: true,
  }
);

messagesSchema.pre("find", function () {
  try {
    this.populate("content");
    this.populate("sender", "username profile-picture");
    this.populate("receiver", "username profile-picture");
  } catch (error) {
    Logger.error(error.message);
  }
});
messagesSchema.pre("findOne", function () {
  try {
    this.populate("content");
    this.populate("sender", "username profile-picture");
    this.populate("receiver", "username profile-picture");
  } catch (error) {
    Logger.error(error.message);
  }
});
messagesSchema.pre("save", async function () {
  try {
    await this.populate("content");
    await this.populate("sender", "username profile-picture");
    await this.populate("receiver", "username profile-picture");
  } catch (error) {
    Logger.error(error.message);
  }
});

export default models.Messages || model("Messages", messagesSchema);
