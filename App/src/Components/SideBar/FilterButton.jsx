import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  USERS_FILTER,
  setUsersFilter,
  fetchUsers,
  fetchConversations,
} from "../../Store/Users/index.js";

function FilterButton() {
  const auth = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  return (
    <div
      className="w-full rounded-[15px] py-[5px]
                bg-primary-500 relative h-[50px] shadow-card"
    >
      {/* indicator */}
      <div
        className={`w-[calc(calc(100%/2)-10px)] h-[40px] bg-primary-700 
          absolute top-[5px] left-[5px] rounded-[10px] transition-all duration-300 ease-in-out
          inside-shadow`}
        style={{
          transform: `translateX(${
            users.usersFilter === USERS_FILTER.USERS
              ? "calc(100% + 10px)"
              : "0"
          })`,
        }}
      />
      <div className="w-full flex items-center absolute z-10">
        <button
          onClick={() => {
            dispatch(setUsersFilter(USERS_FILTER.MESSAGES));
            dispatch(fetchConversations());
          }}
          className="w-full h-[40px] text-tertiary-500 outline-none border-none"
        >
          {USERS_FILTER.MESSAGES}
        </button>
        <button
          onClick={() => {
            dispatch(setUsersFilter(USERS_FILTER.USERS));
            dispatch(fetchUsers());
          }}
          className="w-full h-[40px] text-tertiary-500"
        >
          {USERS_FILTER.USERS}
        </button>
      </div>
    </div>
  );
}

export default FilterButton;
