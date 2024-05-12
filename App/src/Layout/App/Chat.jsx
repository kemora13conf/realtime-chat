import ChatHeader from "../../Components/Chat/ChatHeader.jsx";
import MessageForm from "../../Components/Messages/MessageForm.jsx";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import SentMessage from "../../Components/Messages/SentMessage.jsx";
import RecievedMessage from "../../Components/Messages/RecievedMessage.jsx";
import SentMessageSkeleton from "../../Components/Skeletons/SentMessageSkeleton.jsx";
import RecievedMessageSkeleton from "../../Components/Skeletons/RecievedMessageSkeleton.jsx";
import { useParams } from "react-router-dom";
import ChatLoading from "../../Components/Chat/ChatLoading.jsx";
import {
  AddMessage,
  closeChat,
  fetchMessages,
  openChat,
  updateMessageStatusToDelivered,
  updateMessageStatusToSeen,
} from "../../Store/Chat/index.js";
import EmptyChat from "./EmptyChat.jsx";
import SocketContext from "../../Context/LoadSocket.js";
import { updateLastMessageStatus } from "../../Store/Users/index.js";

export default function Chat() {
  const chat = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.chat.openedChat.user);
  const messages = useSelector((state) => state.chat.openedChat.messages);
  const dispatch = useDispatch();
  const param = useParams();
  const chatRef = useRef(null);

  const onNewMessage = (message) => {
    /**
     * Check if the message is for the current chat
     * if so add it to the opened chat messages
     */

    if (message.conversation === user.conversation._id) {
      if (message.sender._id === user._id) {
        if (message.receiver._id === currentUser._id) {
          dispatch(AddMessage(message));
          dispatch(updateLastMessageStatus({...message, status: "SEEN" } ));

          /**
           * Emit Seen event to the server to update the message status
           */
          if (message.status !== "SEEN") {
            SocketContext.socket.emit("message-seen", message);
          }
        }
      }
    }
  };

  const onMessageSeen = (message) => {
    /**
     * Check if the message is for the current chat
     * if so update the message status
     */
    if (message.conversation === user.conversation._id) {
      if (message.sender._id === currentUser._id) {
        if (message.receiver._id === user._id) {
          dispatch(updateMessageStatusToSeen(message));
        }
      }
    }
  };

  const onMessageDelivered = (message) => {
    /**
     * Check if the message is for the current chat
     * if so update the message status
     */
    if (message.conversation === user.conversation._id) {
      if (message.sender._id === currentUser._id) {
        if (message.receiver._id === user._id) {
          dispatch(updateMessageStatusToDelivered(message));
        }
      }
    }
  };

  const onConnect = () => {
    SocketContext.socket.on("new-message", onNewMessage);
    SocketContext.socket.on("message-seen", onMessageSeen);
    SocketContext.socket.on("message-delivered", onMessageDelivered);
  };

  useEffect(() => {
    dispatch(openChat(param.id));
    dispatch(fetchMessages(param.id));
  }, [param.id]);

  useEffect(() => {
    if (chatRef.current) {
      /**
       * We must scroll the down to show the last message.
       * that will happen by scroll the chatRef in Y axis by the Height of it first child
       */
      chatRef.current.scrollTo(0, chatRef.current.children[0].offsetHeight);
    }
  }, [messages]);

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
        SocketContext.socket.off("new-message", onNewMessage);
        SocketContext.socket.off("message-seen", onMessageSeen);
      }
    };
  }, [user]);
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
