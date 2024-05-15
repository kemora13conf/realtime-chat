import React from "react";
import { USERS_FILTER } from "./SideBar.jsx";

function FilterButton({ usersFilter, setUsersFilter }) {
  return (
    <div
      className="w-full rounded-[15px] items-center flex justify-center
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
            usersFilter === USERS_FILTER.USERS ? "calc(100% + 10px)" : "0"
          })`,
        }}
      />
      <div className="w-full flex items-center absolute z-10">
        <button
          onClick={() => {
            setUsersFilter(USERS_FILTER.MESSAGES);
          }}
          className={`w-full h-[40px] 
          ${
            usersFilter === USERS_FILTER.MESSAGES
              ? "text-quaternary-600"
              : "text-tertiary-600"
          }
          border-none flex items-center gap-[10px] justify-center transition-all duration-300 ease-in-out`}
        >
          <i className="fas fa-comments text-sm"></i>
          <p className="text-sm">{USERS_FILTER.MESSAGES}</p>
        </button>
        <button
          onClick={() => {
            setUsersFilter(USERS_FILTER.USERS);
          }}
          className={`w-full h-[40px] 
          ${
            usersFilter === USERS_FILTER.USERS
              ? "text-quaternary-600"
              : "text-tertiary-600"
          }
          border-none flex items-center gap-[10px] justify-center transition-all duration-300 ease-in-out`}
        >
          <i className="fas fa-users text-sm"></i>
          <p className="text-sm">{USERS_FILTER.USERS}</p>
        </button>
      </div>
    </div>
  );
}

export default FilterButton;
