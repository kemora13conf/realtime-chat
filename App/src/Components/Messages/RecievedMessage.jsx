import React from "react";
import { motion } from "framer-motion";
import ImagesMessage from "./ImagesMessage";
import FilesMessage from "./filesMessage";

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
          className="w-full h-full rounded-full shadow-profile cursor-pointer object-cover"
          src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${
            user["profile-picture"]
          }`}
        />
      </div>
      <div className="flex flex-col gap-[5px] max-w-[250px] overflow-hidden">
        <div
          className="relative flex flex-col
            rounded-xl bg-secondary-500 shadow-card
            px-[15px] py-[12px] min-w-[200px] cursor-pointer"
        >
          {msg.type === "TEXT" ? (
            <p className="text-quaternary-600 text-[14px] font-light">
              {msg.text}
            </p>
          ) : msg.type === "IMAGE" ? (
            <ImagesMessage msg={msg} />
          ) : (
            <FilesMessage msg={msg} />
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
