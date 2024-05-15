import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

function Profile() {
  const current_user = useSelector((state) => state.auth.user);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-stretch overflow-y-auto bg-secondary-700
        rounded-[20px] shadow-lg border border-primary-500 px-[20px] py-[10px] md:p-[30px] md:py-[15px]"
    >
      <h2 className="text-quaternary-500 text-2xl font-['Montserrat'] font-light flex flex-col">
        <span className="font-bold text-3xl">{current_user.username}</span> Profile
      </h2>
    </motion.div>
  );
}

export default Profile;
