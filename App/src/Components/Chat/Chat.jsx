import ChatHeader from "./ChatHeader";
import MessageForm from "../Messages/MessageForm";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../Store/Chat/index.js";
import socketContext from "../../Context/LoadSocket.js";
import SentMessage from "../Messages/SentMessage.jsx";
import RecievedMessage from "../Messages/RecievedMessage.jsx";
import SentMessageSkeleton from "../Skeletons/SentMessageSkeleton.jsx";
import RecievedMessageSkeleton from "../Skeletons/RecievedMessageSkeleton.jsx";

export default function Chat() {
  const chat = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.chat.openedChat.user);
  const messages = useSelector((state) => state.chat.openedChat.messages);
  const dispatch = useDispatch();

  const chatRef = useRef(null);

  useEffect(() => {
    socketContext.on("message", () => {
      dispatch(fetchMessages(user._id));
    });
  }, []);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1 , y: 0 }}
      exit={{ opacity: 0 , y: -20 }}
      transition={{ duration: 0.3 }}
      key={user._id}
      className="w-full flex flex-col items-stretch overflow-y-auto bg-secondary-700
            rounded-[20px] shadow-lg border border-primary-500"
    >
      <ChatHeader />
      <div
        ref={chatRef}
        className="w-full h-full max-h-[450px] overflow-y-auto px-5 py-5"
      >
        <div className="w-full h-fit flex flex-col items-start gap-2">
          {chat.isMessagesFetching ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col gap-[15px]"
            >
              <SentMessageSkeleton />
              <RecievedMessageSkeleton />
              <SentMessageSkeleton />
              <RecievedMessageSkeleton />
            </motion.div>
          ) : (
            messages.map((message) => {
              if (message.sender === currentUser._id) {
                return (
                  <SentMessage
                    key={message._id}
                    user={currentUser}
                    msg={message}
                  />
                );
              } else {
                return (
                  <RecievedMessage
                    key={message._id}
                    user={user}
                    msg={message}
                  />
                );
              }
            })
          )}
        </div>
      </div>
      <MessageForm />
    </motion.div>
  );
}
