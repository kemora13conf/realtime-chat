import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LastMessage from "../Messages/LastMessage.jsx";
import UnreadMesssages from "./UnreadMesssages.jsx";
import SocketContext from "../../Context/LoadSocket.js";
import {
  updateLastMessageStatus,
  updateLastMessage,
  MoveToTop,
} from "../../Store/Users/index.js";

function Conversation({ conversation }) {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const participant =
    conversation.startedBy._id === currentUser._id
      ? conversation.to
      : conversation.startedBy;

  const amIlastMessageSender =
    conversation.last_message &&
    conversation.last_message.sender._id === currentUser._id;
  const isLastMessageSeen =
    conversation.last_message && conversation.last_message.status === "SEEN";

  const update_last_message = (message) => {
    dispatch(updateLastMessageStatus(message));
  };
  const onNewMessage = (message) => {
    dispatch(updateLastMessage(message));
    dispatch(MoveToTop(conversation._id));
    SocketContext.socket.emit("message-delivered", message);
  };

  const onConnect = () => {
    SocketContext.socket.on("new-message", onNewMessage);
    SocketContext.socket.on("message-seen", update_last_message);
    SocketContext.socket.on("message-delivered", update_last_message);
  };
  useEffect(() => {
    if (SocketContext.socket && SocketContext.socket.connected) {
      onConnect();
    } else {
      SocketContext.getSocket().on("connect", onConnect);
    }

    return () => {
      if (SocketContext.socket && SocketContext.socket.connected) {
        SocketContext.socket.off("new-message", updateLastMessage);
        SocketContext.socket.off("message-seen", updateLastMessage);
        SocketContext.socket.off("message-delivered", updateLastMessage);
      }
    };
  }, []);

  return (
    <Link
      onClick={() => {
        /**
         * if the last message is not from the current user
         * and the last message is not seen
         * dispatch an action to update the message status to seen
         */
        if (!amIlastMessageSender && !isLastMessageSeen) {
          dispatch(
            updateLastMessageStatus({
              ...conversation.last_message,
              status: "SEEN",
            })
          );
        }
      }}
      to={`/conversation/${participant.username}`}
      key={participant._id}
      className={`flex gap-[10px] items-center p-[10px] rounded-[15px] 
                transition-all duration-300 cursor-pointer hover:bg-primary-500 hover:bg-opacity-20
                relative ${
                  conversation.last_message &&
                  !amIlastMessageSender &&
                  !isLastMessageSeen
                    ? "bg-tertiary-700 bg-opacity-20"
                    : ""
                }`}
    >
      <img
        src={`data:${participant["profile-picture"].contentType};base64,${participant["profile-picture"].data}`}
        className="w-[44px] h-[44px] rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
      />
      <div className="flex flex-col">
        <div className="font-bold text-quaternary-500 text-lg font-['Montserrat'] ">
          {participant.username}
        </div>
        <div className="font-light text-quaternary-700 text-xs font-['Montserrat']">
          <LastMessage message={conversation.last_message} />
        </div>
      </div>
      {conversation.last_message &&
        !amIlastMessageSender &&
        !isLastMessageSeen && (
          <UnreadMesssages conversationId={conversation._id} />
        )}
    </Link>
  );
}

export default Conversation;
