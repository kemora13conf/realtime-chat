import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketContext from "../../Context/LoadSocket.js";
import {
  USERS_FILTER,
  fetchConversations,
  fetchUsers,
} from "../../Store/Users/index.js";
import User from "./User.jsx";
import { AnimatePresence, motion } from "framer-motion";
import UserSkeleton from "../Skeletons/UserSkeleton.jsx";

function UsersList() {
  const auth = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-[15px]"
    >
      {users.isUsersFetching ? (
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
      ) : users.users.length > 0 ? (
        users.users?.map((user) => <User key={user._id} user={user} />)
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