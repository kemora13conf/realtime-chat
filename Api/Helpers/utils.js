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
      // data: ConvertBufferToBase64(user["profile-picture"].data),
      data: null
    },
  };
}


/**
 * Get the conversation between two participants or create a new one.
 * @param {Object} participants - An object containing the current user and the other user.
 * @param {Object} participants.current_user - The current user object.
 * @param {Object} participants.user - The other user object.
 * @returns {Promise<mongoose.Document>} The conversation document.
 */
export const getConversationByParticipantsOrCreateOne = async (participants) => {
  const { current_user, user } = participants;

  const conversation = await Conversations.findOne({
    $or: [
      { startedBy: current_user._id, to: user._id },
      { startedBy: user._id, to: current_user._id },
    ],
  });

  return conversation || await createConversation(participants);
};

/**
 * Create a new conversation between two participants.
 * @param {Object} participants - An object containing the current user and the other user.
 * @param {Object} participants.current_user - The current user object.
 * @param {Object} participants.user - The other user object.
 * @returns {Promise<mongoose.Document>} The newly created conversation document.
 */
export const createConversation = async (participants) => {
  const { current_user, user } = participants;

  try {
    return await Conversations.create({
      startedBy: current_user._id,
      to: user._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Conversation already exists, retrieve it
      return await getConversationByParticipantsOrCreateOne(participants);
    }
    throw error;
  }
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
        ...file._doc,
        message:
          file.contentType === "text/plain"
            ? ConvertBufferToString(file.message)
            : null,
      };
    }),
  };
};
