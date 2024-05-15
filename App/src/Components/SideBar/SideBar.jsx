import { useState } from "react";
import CurrentUser from "./currentUserCard/CurrentUserCard.jsx";
import FilterButton from "./FilterButton.jsx";
import UsersList from "./UsersList.jsx";
import { AnimatePresence } from "framer-motion";

export const USERS_FILTER = {
  MESSAGES: "Messages",
  USERS: "Users",
};

import ConversationsList from "./ConversationsList.jsx";
import { useParams } from "react-router-dom";

export default function SideBar({ bounds }) {
  const [usersFilter, setUsersFilter] = useState(USERS_FILTER.MESSAGES);

  const param = useParams();

  return (
    <div
      className={`w-full max-h-screen 
      ${bounds.width > 720 ? "flex" : param.id ? "hidden" : "flex"} 
      flex-col items-center gap-5 p-[10px]
      transition-all duration-300 ease-in-out
      @[600px]/home:max-w-[300px] `}
    >
      <CurrentUser />
      <FilterButton {...{ usersFilter, setUsersFilter }} />
      <AnimatePresence mode="wait">
        {usersFilter == USERS_FILTER.USERS ? (
          <UsersList />
        ) : (
          <ConversationsList />
        )}
      </AnimatePresence>
    </div>
  );
}
