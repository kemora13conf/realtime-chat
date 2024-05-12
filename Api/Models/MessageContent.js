import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const messageContentSchema = new Schema({
    message: {
        type: Buffer,
        required: true,
    
    },
    contentType: {
        type: String,
        required: true,
    },
    fileName : {
        type: String,
    },
    fileSize: {
        type: Number,
    },
});

export default models.MessageContent || model("MessageContent", messageContentSchema);