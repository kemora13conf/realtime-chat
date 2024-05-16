import { useState } from "react";
import CurrentUser from "../../Components/SideBar/currentUserCard/CurrentUserCard.jsx";
import FilterButton from "../../Components/SideBar/FilterButton.jsx";
import UsersList from "../../Components/SideBar/UsersList.jsx";
import { AnimatePresence } from "framer-motion";
import ConversationsList from "../../Components/SideBar/ConversationsList.jsx";
import { useLocation, useParams } from "react-router-dom";

export const USERS_FILTER = {
  MESSAGES: "Messages",
  USERS: "Users",
};

export default function SideBar({ bounds }) {
  const [usersFilter, setUsersFilter] = useState(USERS_FILTER.MESSAGES);

  const location = useLocation();
  const isNotHome = location.pathname !== "/";

  return (
    <div
      className={`w-full max-h-screen 
      ${bounds.width > 720 ? "flex" : isNotHome ? "hidden" : "flex"} 
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
