import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

export default function MessageForm() {
  const currentUser = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.chat.openedChat.user);

  const [msg, setMsg] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API}/conversations/${user._id}/message`, {
      method: "POST",
      headers: {
        Authorization: `Bareer ${Cookies.get("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: currentUser._id,
        receiver: user._id,
        text: msg,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.type == "success") {
          //   socket.emit("message", user._id);
        }
      });
  }
  return (
    <div className="w-full flex mt-auto p-[10px] gap-[10px] bg-secondary-800 rounded-b-[20px]">
      <div
        className="w-fit h-[48px]
            flex items-center p-[8px]"
      >
        <button
          className="h-full aspect-square flex justify-center items-center
                    text-tertiary-500 transition-all group hover:text-quaternary-500"
        >
          <i className="fas fa-paperclip"></i>
        </button>
        <button
          className="h-full aspect-square flex justify-center items-center
                    text-tertiary-500 transition-all group hover:text-quaternary-500"
        >
          <i className="fas fa-image"></i>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex items-center relative">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full h-[48px] rounded-[10px] bg-primary-500 px-5 
          text-quaternary-600 border-solid border-[1.7px] border-transparent 
          outline-none placeholder:text-tertiary-600 
          transition-all focus:border-tertiary-700 pr-[50px]"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="w-[48px] h-[48px] rounded-full
            flex justify-center items-center transition-all group
            absolute right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-tertiary-500 transition-all group-hover:fill-quaternary-500"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
