import { useEffect, useState } from "react";
import CurrentUser from "./CurrentUserCard.jsx";
import Cookies from "js-cookie";
import FilterButton from "./FilterButton.jsx";
import UsersList from "./UsersList.jsx";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  USERS_FILTER,
  fetchConversations,
  fetchUsers,
} from "../../Store/Users/index.js";
import ConversationsList from "./ConversationsList.jsx";

export default function SideBar({ parentWidth }) {
  const users = useSelector((state) => state.users);
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
      className="w-full max-h-screen flex flex-col items-center gap-5 p-[10px]
      transition-all duration-300 ease-in-out
      @[600px]/home:max-w-[300px]"
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
