import React from "react";
import { motion } from "framer-motion";
import ImagesMessage from "./ImagesMessage.jsx";
import FilesMessage from "./filesMessage.jsx";
import MessageStatus from "./MessageStatus.jsx";

function SentMessage({ msg, user }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      key={msg._id + msg.status}
      className="flex gap-4 flex-row-reverse ml-auto"
    >
      <div className="h-[40px] aspect-square rounded-full bg-primary-500">
        <img
          className="w-full h-full rounded-full shadow-profile cursor-pointer object-cover"
          src={`data:${user["profile-picture"].contentType};base64,${user["profile-picture"].data}`}
        />
      </div>
      <div className="flex flex-col gap-[5px] max-w-[250px] overflow-hidden">
        <div
          className="relative flex flex-col
            rounded-xl bg-primary-700 shadow-card
            px-[15px] py-[12px] min-w-[200px] cursor-pointer"
        >
          {msg.type === "TEXT" ? (
            <p className="text-quaternary-600 text-[14px] font-light">
              {msg.content[0].message}
            </p>
          ) : msg.type === "IMAGE" ? (
            <ImagesMessage msg={msg} />
          ) : (
            <FilesMessage msg={msg} />
          )}
        </div>
        <div className="flex gap-[10px] text-tertiary-600 font-light text-[13px] pl-[5px] ml-auto mr-[10px]">
          {new Date(msg.createdAt).toLocaleTimeString()}
          <MessageStatus status={msg.status} />
        </div>
      </div>
    </motion.div>
  );
}

export default SentMessage;
