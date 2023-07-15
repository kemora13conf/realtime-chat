import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const messagesSchema = new mongoose.Schema({
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
    text: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
});

export default models.Messages || model("Messages", messagesSchema);