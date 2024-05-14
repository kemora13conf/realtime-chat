import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  USERS_FILTER,
  setUsersFilter,
  fetchUsers,
  fetchConversations,
} from "../../Store/Global/index.js";

function FilterButton() {
  const auth = useSelector((state) => state.auth);
  const global = useSelector((state) => state.global);
  const dispatch = useDispatch();
  return (
    <div
      className="w-full rounded-[15px] py-[5px]
                bg-primary-500 relative min-h-[50px] shadow-profile
                border border-secondary-500"
    >
      {/* indicator */}
      <div
        className={`w-[calc(calc(100%/2)-10px)] h-[40px] bg-primary-700 
          absolute top-[4px] left-[4px] rounded-[10px] transition-all duration-300 ease-in-out
          inside-shadow border border-secondary-500`}
        style={{
          transform: `translateX(${
            global.usersFilter === USERS_FILTER.USERS
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
