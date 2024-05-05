import React from "react";

function SentMessageSkeleton() {
  return (
    <div
      className="w-fit ml-auto flex items-center p-[10px] rounded-[15px] 
        transition-all duration-300 cursor-pointer animate-pulse"
    >
      <div className="flex items-center">
        <div>
          <div className="w-48 h-2.5 mb-2 bg-primary-400 rounded-full "></div>
          <div className="w-32 h-2 ml-auto bg-secondary-500 rounded-full"></div>
        </div>
      </div>
      <svg
        className="w-10 h-10 ms-3 text-primary-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
      </svg>
    </div>
  );
}

export default SentMessageSkeleton;
