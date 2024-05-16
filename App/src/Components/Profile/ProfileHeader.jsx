import React from "react";
import { useNavigate } from "react-router-dom";

function ProfileHeader({ current_user }) {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-[10px] w-full sticky top-[10px] z-50
    bg-primary-700 py-[10px] px-[10px] rounded-[20px] 
    shadow-message border border-primary-500"
    >
      {/* go back button */}
      <button
        onClick={() => {
          navigate("/");
        }}
        className="text-tertiary-500 rounded-full h-[40px] aspect-square flex items-center justify-center
            hover:bg-primary-500 hover:text-tertiary-500 transition-all duration-300 ease-in-out"
      >
        <i className="fas fa-arrow-left"></i>
      </button>

      <h2 className="text-quaternary-500 text-xl font-['Montserrat'] font-light flex flex-col">
        Profile of
        <span className="font-bold text-3xl">{current_user.username}</span>{" "}
      </h2>
    </div>
  );
}

export default ProfileHeader;
