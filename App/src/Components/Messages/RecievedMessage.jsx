import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ImageMessage from "./ImageMessage.jsx";
import FileMessage from "./FileMessage.jsx";
import Cookies from "js-cookie";

function RecievedMessage({ msg, user }) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      key={msg._id}
      className="flex gap-4"
    >
      <div className="h-[40px] aspect-square rounded-full bg-primary-500">
        <img
          src={`${import.meta.env.VITE_API}/users/${
            user._id
          }/profile-picture?token=${Cookies.get("jwt")}`}
          className="w-full h-full rounded-full shadow-profile cursor-pointer object-cover"
        />
      </div>
      <div className="flex flex-col gap-[5px] max-w-[250px]">
        <div
          className="relative flex flex-col
            rounded-xl bg-primary-500 cursor-pointer
            px-[15px] py-[12px] min-w-[200px] overflow-hidden shadow-message
            transition-all duration-300 ease-in-out
            border border-secondary-500 hover:border-primary-400"
        >
          {msg.type === "TEXT" ? (
            <p className="text-quaternary-600 text-[14px] font-light">
              {msg.content[0].message}
            </p>
          ) : msg.type === "IMAGE" ? (
            <ImageMessage msg={msg} />
          ) : (
            <FileMessage msg={msg} />
          )}
        </div>
        <div className="flex gap-1 text-tertiary-600 font-light text-[13px] pl-[5px]">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}

export default RecievedMessage;
