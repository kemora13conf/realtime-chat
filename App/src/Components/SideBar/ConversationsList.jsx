import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Conversation from "./Conversation.jsx";
import UserSkeleton from "../Skeletons/UserSkeleton.jsx";
import Cookies from "js-cookie";

function ConversationsList() {
  const [isConversationsFetching, setIsConversationsFetching] = useState(false);
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    setIsConversationsFetching(true);
    let url = `${import.meta.env.VITE_API}/conversations`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    const res = await response.json();
    if (res.type === "success") {
      setConversations(res.data.conversations ? res.data.conversations : []);
    }
    setIsConversationsFetching(false);
  };

  const updateLastMessage = (message) => {
    setConversations((prev) => {
      const conversation = prev.find(
        (conversation) => conversation._id === message.conversation
      );
      if (conversation) {
        conversation.last_message = message;
      }
      return [...prev];
    });
  };

  const MoveToTop = (conversationId) => {
    setConversations((prevConversations) => {
      const conversation = prevConversations.find(
        (conversation) => conversation._id === conversationId
      );
      if (conversation) {
        prevConversations.splice(prevConversations.indexOf(conversation), 1);
        prevConversations.unshift(conversation);
      }
      return [...prevConversations];
    });
  };

  const updateLastMessageStatusToSeen = (message) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation) => {
        if (
          conversation._id === message.conversation &&
          conversation.last_message._id === message._id
        ) {
          conversation.last_message.status = "SEEN";
        }
        return conversation;
      })
    );
  };

  const updateLastMessageStatusToDelivered = (message) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation) => {
        if (
          conversation._id === message.conversation &&
          conversation.last_message._id === message._id &&
          conversation.last_message.status !== "SEEN"
        ) {
          conversation.last_message.status = "DELIVERED";
        }
        return conversation;
      })
    );
  };

  useEffect(() => {
    fetchConversations();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-[15px] min-h-[400px] overflow-y-auto"
    >
      {isConversationsFetching ? (
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
      ) : conversations.length > 0 ? (
        conversations.map((conversation) => (
          <Conversation
            key={conversation._id}
            {...{
              conversation,
              updateLastMessageStatusToDelivered,
              updateLastMessageStatusToSeen,
              MoveToTop,
              updateLastMessage,
            }}
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
