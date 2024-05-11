import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LastMessage from "../Messages/LastMessage.jsx";
import SocketContext from "../../Context/LoadSocket.js";
import { updateLastMessage } from "../../Store/Users/index.js";

function Conversation({ conversation }) {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const participant =
    conversation.startedBy._id === currentUser._id
      ? conversation.to
      : conversation.startedBy;
  const newMessage = (msg) => {
    if(conversation._id === msg.conversation){
      dispatch(updateLastMessage({ conversationId: conversation._id, message: msg }));
    }
  }
  useEffect(() => {
    if (SocketContext.socket?.connected) {
      SocketContext.socket.on("new-message", (data) => {
        newMessage(data);
      });
    } else {
      SocketContext.getSocket().on("connect", () => {
        SocketContext.socket.on("new-message", (data) => {
          newMessage(data);
        });
      });
    }
  }, []);
  return (
    <Link
      to={`/conversation/${participant.username}`}
      key={participant._id}
      className="flex gap-[10px] items-center p-[10px] rounded-[15px] 
                    transition-all duration-300 cursor-pointer hover:bg-primary-500 hover:bg-opacity-20"
    >
      <img
        src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${
          participant["profile-picture"]
        }`}
        className="w-[44px] h-[44px] rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
      />
      <div className="flex flex-col">
        <div className="font-bold text-quaternary-500 text-lg font-['Montserrat'] ">
          {participant.username}
        </div>
        <div className="font-light text-quaternary-700 text-xs font-['Montserrat']">
          <LastMessage message={conversation.last_message} />
        </div>
      </div>
    </Link>
  );
}

export default Conversation;
