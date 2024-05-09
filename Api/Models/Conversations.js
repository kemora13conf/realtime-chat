import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const conversationsSchema = new Schema(
  {
    startedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    last_message: {
      type: Schema.Types.ObjectId,
      ref: "Messages",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Conversations ||
  model("Conversations", conversationsSchema);
