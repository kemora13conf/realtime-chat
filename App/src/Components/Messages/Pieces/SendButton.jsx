import React from "react";

function SendButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[48px] h-[48px] rounded-full
        flex justify-center items-center transition-all group
        "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6 fill-tertiary-500 transition-all group-hover:fill-quaternary-500"
      >
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
      </svg>
    </button>
  );
}

export default SendButton;