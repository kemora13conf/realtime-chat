import ChatHeader from "../Components/Chat/ChatHeader.jsx";
import MessageForm from "../Components/Messages/MessageForm.jsx";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SentMessage from "../Components/Messages/SentMessage.jsx";
import RecievedMessage from "../Components/Messages/RecievedMessage.jsx";
import SentMessageSkeleton from "../Components/Skeletons/SentMessageSkeleton.jsx";
import RecievedMessageSkeleton from "../Components/Skeletons/RecievedMessageSkeleton.jsx";
import { useParams } from "react-router-dom";
import ChatLoading from "../Components/Chat/ChatLoading.jsx";
import EmptyChat from "./EmptyChat.jsx";
import SocketContext from "../Context/LoadSocket.js";
import useChat from "../Hooks/useChat.js";
import { useDispatch, useSelector } from "react-redux";

export default function Chat() {
  const {
    fetchUser,
    fetchMessages,
    user,
    messages,
    AddMessage,
    isLoading,
    isMessagesFetching,
    onConnect,
    onDisconnect,
  } = useChat();

  const current_user = useSelector((state) => state.auth.user);

  const param = useParams();
  const chatRef = useRef(null);

  /**
   * Load the user of the current chat
   */
  useEffect(() => {
    fetchUser(param.id);
  }, [param.id]);

  /**
   * Load the messages of the current chat
   */
  useEffect(() => {
    if (user) {
      fetchMessages(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (chatRef.current) {
      /**
       * We must scroll the down to show the last message.
       * that will happen by scroll the chatRef in Y axis by the Height of it first child
       */
      chatRef.current.scrollTo(0, chatRef.current.children[0].offsetHeight);
    }
  }, [messages]);

  /**
   * Handle the comming messages events from the server
   */
  useEffect(() => {
    if (user) {
      if (SocketContext.socket && SocketContext.socket.connected) {
        onConnect();
      } else {
        SocketContext.getSocket().on("connect", onConnect);
      }
    }
    return () => {
      if (SocketContext.socket && SocketContext.socket.connected) {
        onDisconnect();
      }
    };
  }, [user]);

  return (
    user && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        key={user?._id}
        className="w-full flex flex-col items-stretch overflow-y-auto bg-secondary-700
            rounded-[20px] shadow-lg border border-primary-500"
      >
        {isLoading ? (
          <ChatLoading />
        ) : (
          <>
            <ChatHeader {...{ user }} />
            <div
              ref={chatRef}
              className="w-full h-full max-h-[100svh] overflow-y-auto p-3 md:p-5"
            >
              <div className="w-full h-fit min-h-[] flex flex-col items-start gap-2">
                <AnimatePresence>
                  {isMessagesFetching ? (
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
                      if (message.sender._id === current_user._id) {
                        return (
                          <SentMessage
                            key={message._id}
                            user={current_user}
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
            <MessageForm
              {...{
                user,
                messages,
                AddMessage,
              }}
            />
          </>
        )}
      </motion.div>
    )
  );
}
