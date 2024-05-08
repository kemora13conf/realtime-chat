import React from 'react'
import { Link } from 'react-router-dom';

function Conversation({ conversation }) {
  return (
    <Link
      to={`/conversation/${conversation.participant._id}`}
      key={conversation.participant._id}
      className="flex gap-[10px] items-center p-[10px] rounded-[15px] 
                    transition-all duration-300 cursor-pointer hover:bg-primary-500 hover:bg-opacity-20"
    >
      <img
        src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${
          conversation.participant["profile-picture"]
        }`}
        className="w-[44px] h-[44px] rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
      />
      <div className="flex flex-col">
        <div className="font-bold text-quaternary-500 text-lg font-['Montserrat'] ">
          {conversation.participant.username}
        </div>
        <div className="font-light text-quaternary-700 text-xs font-['Montserrat']">
          {/* last seen */}
          {conversation.messages.length > 0
            ? conversation.messages[conversation.messages.length - 1].text
            : "No messages"}
        </div>
      </div>
    </Link>
  );
}

export default Conversation
