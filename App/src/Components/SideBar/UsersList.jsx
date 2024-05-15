import React, { useEffect, useState } from "react";
import User from "./User.jsx";
import { motion } from "framer-motion";
import UserSkeleton from "../Skeletons/UserSkeleton.jsx";
import Cookies from "js-cookie";

function UsersList() {
  const [isUsersFetching, setUsersFetching] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    setUsersFetching(true);
    let url = `${import.meta.env.VITE_API}/users`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    const res = await response.json();
    if (res.type === "success") {
      setUsers(res.data.users ? res.data.users : []);
    }
    setUsersFetching(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-[15px]"
    >
      {isUsersFetching ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col gap-[15px]"
        >
          <UserSkeleton />
          <UserSkeleton />
        </motion.div>
      ) : users.length > 0 ? (
        users?.map((user) => <User key={user._id} user={user} />)
      ) : (
        <div className="flex flex-col gap-[5px] p-[10px]">
          <h2 className="text-center text-quaternary-500 font-['Montserrat'] font-light">
            No Users Yet
          </h2>
          <p className="text-center text-tertiary-500 font-['Montserrat'] font-light text-xs">
            Start a conversation with a user to see them here
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default UsersList;
