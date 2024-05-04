import { useEffect, useState } from "react";
import User from "../User.jsx";
import CurrentUser from "../CurrentUserCard.jsx";
import Cookies from "js-cookie";
import socketContext from "../../Context/LoadSocket.js";
import FilterButton from "./FilterButton.jsx";
import UsersList from "./UsersList.jsx";

export default function SideBar({ parentWidth }) {
  
  return (
    <div
      className="w-full max-h-screen h-full flex flex-col items-center gap-5 p-[10px]
            absolute transition-all duration-300 ease-in-out
            @[600px]/home:max-w-[300px]"
    >
      <CurrentUser />
      <FilterButton />
      <UsersList />
    </div>
  );
}
