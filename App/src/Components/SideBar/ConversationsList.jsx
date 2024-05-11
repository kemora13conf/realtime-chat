import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Conversation from "./Conversation.jsx";
import UserSkeleton from "../Skeletons/UserSkeleton.jsx";
import SocketContext from "../../Context/LoadSocket.js";
import { updateLastMessageStatus } from "../../Store/Users/index.js";

function ConversationsList() {
  const users = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (SocketContext.socket?.connected) {
        SocketContext.socket.on("message-delivered", (message) => {
          dispatch(updateLastMessageStatus(message));
          if (message.receiver._id == currentUser._id) {
            SocketContext.socket.emit("message-delivered", message);
          }
        });

      SocketContext.socket.on("message-seen", (message) => {
        dispatch(updateLastMessageStatus(message));
      });
    } else {
      SocketContext.getSocket().on("connect", () => {
        SocketContext.socket.on("message-delivered", (message) => {
          dispatch(updateLastMessageStatus(message));
          if (message.receiver._id == currentUser._id) {
            SocketContext.socket.emit("message-delivered", message);
          }
        });

        SocketContext.socket.on("message-seen", (message) => {
          dispatch(updateLastMessageStatus(message));
        });
      });
    }
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-[15px]"
    >
      {users.isConversationsFetching ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col gap-[15px]"
        >
          <UserSkeleton />
          <UserSkeleton />
        </motion.div>
      ) : users.conversations.length > 0 ? (
        users.conversations.map((conversation) => (
          <Conversation key={conversation._id} conversation={conversation} />
        ))
      ) : (
        <div className="flex flex-col gap-[5px] p-[10px]">
          <h2 className="text-center text-quaternary-500 font-['Montserrat'] font-light">
            No Conversations Yet
          </h2>
          <p className="text-center text-tertiary-500 font-['Montserrat'] font-light text-xs">
            Start a conversation with a user to see them here
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default ConversationsList;
