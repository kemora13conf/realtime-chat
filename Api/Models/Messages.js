import mongoose from "mongoose";

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
    text: {
      type: String,
      default: "",
    },
    files: {
      type: Array,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
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

/**
 * @middleware
 * @param {NextFunction} next
 * @description set the text, files or image to empty string if the type is not the same
 */
messagesSchema.pre("save", function (next) {
  try {
    if (this.type !== MESSAGE_TYPES.TEXT) {
      this.text = "";
    }
    if (this.type !== MESSAGE_TYPES.FILE) {
      this.files = [];
    }
    if (this.type !== MESSAGE_TYPES.IMAGE) {
      this.image = "";
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default models.Messages || model("Messages", messagesSchema);
