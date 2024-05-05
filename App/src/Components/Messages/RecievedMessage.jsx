import React from "react";
import { motion } from "framer-motion";

function RecievedMessage({ msg, user }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      key={msg._id}
      className="flex gap-4"
    >
      <div className="h-[40px] aspect-square rounded-full bg-primary-500">
        <img
          className="w-full h-full rounded-full shadow-profile cursor-pointer object-cover"
          src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${
            user["profile-picture"]
          }`}
        />
      </div>
      <div className="flex flex-col gap-[5px] max-w-[250px]">
        <div
          className="relative flex flex-col
            rounded-xl bg-secondary-500 shadow-card
            px-[15px] py-[12px] min-w-[200px] cursor-pointer"
        >
          <div className="font-['Montserrat'] text-tertiary-300">
            {msg.text}
          </div>
        </div>
        <div className="flex gap-1 text-tertiary-600 font-light text-[13px] pl-[5px]">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}

export default RecievedMessage;
