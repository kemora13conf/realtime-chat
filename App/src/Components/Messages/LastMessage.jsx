import React from "react";
import MessageStatus from "./MessageStatus.jsx";
import { useSelector } from "react-redux";

function LastMessage({ message }) {
  const user = useSelector((state) => state.auth.user);
  const TYPES = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    FILE: "FILE",
  };
  
  return message ? (
    <div className="flex gap-[5px] items-center">
      {user._id == message.sender._id ? (
        <MessageStatus status={message.status} />
      ) : null}
      {message.type === TYPES.TEXT && (
        <span className="text-tertiary-500 font-['Montserrat'] font-light">
          {message.content[0].message}
        </span>
      )}
      {message.type === TYPES.IMAGE && (
        <span className="text-tertiary-500 font-['Montserrat'] font-light flex items-center gap-[10px]">
          <i className="fas fa-image"></i>
          {message.content[0].fileName.length > 20
            ? message.content[0].fileName.substring(0, 17) +
              "..." +
              message.content[0].fileName.slice(-3)
            : message.content[0].fileName}
        </span>
      )}
      {message.type === TYPES.FILE && (
        <span className="text-tertiary-500 font-['Montserrat'] font-light flex items-center gap-[10px]">
          <i className="fas fa-paperclip"></i>
          {message.content.length} files
        </span>
      )}
    </div>
  ) : (
    "No messages yet"
  );
}

export default LastMessage;
