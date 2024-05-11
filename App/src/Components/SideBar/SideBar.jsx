import { useEffect, useState } from "react";
import CurrentUser from "./CurrentUserCard.jsx";
import FilterButton from "./FilterButton.jsx";
import UsersList from "./UsersList.jsx";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  MoveToTop,
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
  const chat = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      users.usersFilter === USERS_FILTER.USERS
        ? fetchUsers()
        : fetchConversations()
    );
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
