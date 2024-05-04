import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  USERS_FILTER,
  setUsersFilter,
  fetchUsers,
} from "../../Store/Global/index.js";

function FilterButton() {
  const auth = useSelector((state) => state.auth);
  const global = useSelector((state) => state.global);
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
          inside-shadow]`}
        style={{
          transform: `translateX(${
            global.usersFilter === USERS_FILTER.ONLINE
              ? "calc(100% + 10px)"
              : "0"
          })`,
        }}
      />
      <div className="w-full flex items-center absolute z-10">
        <button
          onClick={() => {
            dispatch(setUsersFilter(USERS_FILTER.ALL));
            dispatch(fetchUsers(USERS_FILTER.ALL));
          }}
          className="w-full h-[40px] text-tertiary-500 outline-none border-none"
        >
          All
        </button>
        <button
          onClick={() => {
            dispatch(setUsersFilter(USERS_FILTER.ONLINE));
            dispatch(fetchUsers(USERS_FILTER.ONLINE));
          }}
          className="w-full h-[40px] text-tertiary-500"
        >
          Online
        </button>
      </div>
    </div>
  );
}

export default FilterButton;
