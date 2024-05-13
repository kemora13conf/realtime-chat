import Conversations from "../Models/Conversations.js";

export const answerObject = (type, message, data = null) => {
  return {
    type: type,
    message: message,
    data: data,
  };
};

export const SerializeUser = (user) => {
  return {
    ...user._doc,
    "profile-picture": {
      ...user["profile-picture"],
      data: ConvertBufferToBase64(user["profile-picture"].data),
    },
  };
}

export const GetConversationByParticipantsOrCreateOne = async (
  participants
) => {
  return (
    (await Conversations.findOne({
      $or: [
        { startedBy: participants.current_user._id, to: participants.user._id },
        { startedBy: participants.user._id, to: participants.current_user._id },
      ],
    })) || (await CreateConversation(participants))
  );
};

export const CreateConversation = async (participants) => {
  return await Conversations.create({
    startedBy: participants.current_user._id,
    to: participants.user._id,
  });
};

export const ConvertBufferToString = (data) => {
  return Buffer.from(data, "utf-8").toString();
};

export const ConvertBufferToBase64 = (image) => {
  return Buffer.from(image).toString("base64");
};

/**
 * Serialize the message content to be sent to the client
 * @param {Object} message
 * @returns {Object} serialized message
 */
export const SerializeMessageContent = (message) => {
  return {
    ...message._doc,
    sender: SerializeUser(message.sender),
    receiver: SerializeUser(message.receiver),
    content: message.content.map((file) => {
      return {
        _id: file._id,
        message:
          file.contentType === "text/plain"
            ? ConvertBufferToString(file.message)
            : ConvertBufferToBase64(file.message),
        fileName: file.fileName,
        fileSize: file.fileSize,
      };
    }),
  };
};
