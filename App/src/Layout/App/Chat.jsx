import ChatHeader from "../../Components/Chat/ChatHeader.jsx";
import MessageForm from "../../Components/Messages/MessageForm.jsx";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import SentMessage from "../../Components/Messages/SentMessage.jsx";
import RecievedMessage from "../../Components/Messages/RecievedMessage.jsx";
import SentMessageSkeleton from "../../Components/Skeletons/SentMessageSkeleton.jsx";
import RecievedMessageSkeleton from "../../Components/Skeletons/RecievedMessageSkeleton.jsx";
import { useParams } from "react-router-dom";
import ChatLoading from "../../Components/Chat/ChatLoading.jsx";
import { closeChat, fetchMessages, openChat } from "../../Store/Chat/index.js";
import EmptyChat from "./EmptyChat.jsx";

export default function Chat() {
  const chat = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.chat.openedChat.user);
  const messages = useSelector((state) => state.chat.openedChat.messages);
  const dispatch = useDispatch();
  const param = useParams();
  const chatRef = useRef(null);

  useEffect(() => {
    dispatch(openChat(param.id));
    dispatch(fetchMessages(param.id));
  }, [param.id]);
  useEffect(() => {
    if (messages.length > 0)
      chatRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    return () => {
      dispatch(closeChat());
    };
  }, []);
  return user == null ? (
    <EmptyChat />
  ) : (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      key={user?._id}
      className="w-full flex flex-col items-stretch overflow-y-auto bg-secondary-700
            rounded-[20px] shadow-lg border border-primary-500"
    >
      {chat.isLoading ? (
        <ChatLoading />
      ) : (
        <>
          <ChatHeader />
          <div
            ref={chatRef}
            className="w-full h-full max-h-[450px] overflow-y-auto p-3 md:p-5"
          >
            <div className="w-full h-fit flex flex-col items-start gap-2">
              <AnimatePresence>
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
                    if (message.sender._id === currentUser._id) {
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
              </AnimatePresence>
            </div>
          </div>
          <MessageForm />
        </>
      )}
    </motion.div>
  );
}
