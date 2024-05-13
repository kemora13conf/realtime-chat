import React from 'react';
import { Link } from 'react-router-dom';

function User({ user }) {
  return (
    <Link
      to={`/conversation/${user.username}`}
      key={user._id}
      className="flex gap-[10px] items-center p-[10px] rounded-[15px] 
          transition-all duration-300 cursor-pointer hover:bg-primary-500 hover:bg-opacity-20"
    >
      <img
        src={`data:${user["profile-picture"].contentType};base64,${user["profile-picture"].data}`}
        className="w-[44px] h-[44px] rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
      />
      <div className="flex flex-col">
        <div className="font-bold text-quaternary-500 text-lg font-['Montserrat'] ">
          {user.username}
        </div>
        <div className="font-light text-quaternary-700 text-xs font-['Montserrat']">
          {/* last seen */}
          {`Last seen ${new Date(user.last_seen).toLocaleTimeString()}`}
        </div>
      </div>
    </Link>
  );
}

export default User
