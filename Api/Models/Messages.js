import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

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
    type: {
      type: String,
      enum: ["TEXT", "IMAGE", "FILE", "MIXED"],
      default: "TEXT",
    },
    text: {
      type: String,
      default: "",
    },
    file: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Messages || model("Messages", messagesSchema);
