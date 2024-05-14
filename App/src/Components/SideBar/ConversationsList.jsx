import React from "react";
import { motion } from "framer-motion";
import Conversation from "./Conversation.jsx";
import UserSkeleton from "../Skeletons/UserSkeleton.jsx";
import { useSelector } from "react-redux";

function ConversationsList() {
  const global = useSelector((state) => state.global);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-[15px]"
    >
      {global.isConversationsFetching ? (
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
      ) : global.conversations.length > 0 ? (
        global.conversations.map((conversation) => (
          <Conversation
            key={
              conversation.last_message
                ? conversation.last_message.updatedAt
                : conversation._id
            }
            conversation={conversation}
          />
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
