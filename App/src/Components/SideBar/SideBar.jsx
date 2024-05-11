import { useEffect, useState } from "react";
import CurrentUser from "./CurrentUserCard.jsx";
import FilterButton from "./FilterButton.jsx";
import UsersList from "./UsersList.jsx";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  USERS_FILTER,
  fetchConversations,
  fetchUsers,
  updateLastMessage,
  updateLastMessageStatus,
} from "../../Store/Users/index.js";
import ConversationsList from "./ConversationsList.jsx";
import SocketContext from "../../Context/LoadSocket.js";
import { AddMessage, updateMessageStatus } from "../../Store/Chat/index.js";

export default function SideBar({ bounds }) {
  const users = useSelector((state) => state.users);
  const conversations = useSelector((state) => state.users.conversations);
  const chat = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  function onNewMessage(message) {
    // if the message is in the opened chat
    if (
      chat.openedChat.user &&
      message.conversation._id === chat.openedChat.conversation._id
    ) {
      dispatch(AddMessage(message));
    }

    // update the last message of the conversation that the message belongs to
    dispatch(
      updateLastMessage(message)
    );

    // if the message is for the current user
    if (message.receiver._id == currentUser._id) {
      console.log("emitting message-delivered");
      SocketContext.socket.emit("message-delivered", message);
    }
  }

  function onMessageDelivered(message) {
    /**
     * if the message is in the opened chat & the receiver is the current user
     * udate it status to delivered
     */
    if (
      chat.openedChat.user &&
      message.conversation._id === chat.openedChat.conversation._id &&
      message.receiver._id === currentUser._id
    ) {
      dispatch(updateMessageStatus(message));
    }

    /**
     * if the message is the last message of a conversation
     * update the last message status to delivered
     */
    dispatch(updateLastMessageStatus(message));
  }

  useEffect(() => {
    dispatch(
      users.usersFilter === USERS_FILTER.USERS
        ? fetchUsers()
        : fetchConversations()
    );

    if (SocketContext.socket?.connected) {
      SocketContext.socket.on("new-message", (message) => {
        onNewMessage(message);
      });
      SocketContext.socket.on("message-delivered", (message) => {
        onMessageDelivered(message);
      });
    } else {
      SocketContext.getSocket().on("connect", () => {
        SocketContext.socket.on("new-message", (message) => {
          onNewMessage(message);
        });
        SocketContext.socket.on("message-delivered", (message) => {
          onMessageDelivered(message);
        });
      });
    }
  }, []);
  return (
    <div
      className={`w-full max-h-screen 
      ${bounds.width > 720 ? "flex" : chat.openedChat.user ? "hidden" : "flex"} 
      flex-col items-center gap-5 p-[10px]
      transition-all duration-300 ease-in-out
      @[600px]/home:max-w-[300px] `}
    >
      <CurrentUser />
      <FilterButton />
      <AnimatePresence mode="wait">
        {users.usersFilter == USERS_FILTER.USERS ? (
          <UsersList />
        ) : (
          <ConversationsList />
        )}
      </AnimatePresence>
    </div>
  );
}
