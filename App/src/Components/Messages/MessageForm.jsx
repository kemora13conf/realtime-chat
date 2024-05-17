import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import ImageModal from "./Modals/imageModal.jsx";
import FilesModal from "./Modals/FilesModal.jsx";
import SocketContext from "./../../Context/LoadSocket";

export default function MessageForm({ AddMessage, user }) {
  const inputRef = useRef(null);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const [msg, setMsg] = useState("");
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);

  function importFiles(e) {
    if (e.target.files.length > 0) {
      setFiles(e.target.files);
      setIsFilesModalOpen(true);
    }
  }
  function importImage(e) {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setIsImageModalOpen(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (msg.trim() === "") return;
    const data = {
      text: msg,
    };
    setMsg("");
    const response = await fetch(
      `${import.meta.env.VITE_API}/conversations/${user.username}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      const res = await response.json();
      if (res.type == "success") {
        AddMessage(res.data);
      }
    } else {
      toast.error("Failed to send message");
    }
  }
  useEffect(() => {
    /**
     * if the message input is focused i need to emit a typing event
     * if the message input is not focused i need to emit a stop typing event
     */
    if(inputRef.current) {
      inputRef.current.addEventListener("focus", () => {
        SocketContext.socket.emit("typing", { id: user._id, isTyping: true });
      });
      inputRef.current.addEventListener("blur", () => {
        SocketContext.socket.emit("typing", { id: user._id, isTyping: false });
      });
    }
  }, []);
  return (
    <div className="w-full flex mt-auto p-[10px] gap-[10px] bg-secondary-800 rounded-b-[20px] relative">
      <AnimatePresence mode="out-in">
        {isFilesModalOpen && (
          <FilesModal {...{
            files,
            setFiles,
            user,
            AddMessage,
            setIsFilesModalOpen,
          }} />
        )}
        {isImageModalOpen && (
          <ImageModal {...{
            image,
            setImage,
            user,
            AddMessage,
            setIsImageModalOpen,
          }} />
        )}
      </AnimatePresence>
      <div
        className="w-fit h-[48px]
        flex items-center p-[8px]"
      >
        <label
          htmlFor="file"
          className="h-full aspect-square flex justify-center items-center
        text-tertiary-500 transition-all group hover:text-quaternary-500 cursor-pointer"
        >
          <i className="fas fa-paperclip"></i>
          <input
            className="hidden"
            type="file"
            onChange={importFiles}
            id="file"
            multiple
            disabled={isFilesModalOpen || isImageModalOpen}
          />
        </label>
        <label
          htmlFor="image"
          className="h-full aspect-square flex justify-center items-center
        text-tertiary-500 transition-all group hover:text-quaternary-500 cursor-pointer"
        >
          <i className="fas fa-image"></i>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={importImage}
            id="image"
            disabled={isFilesModalOpen || isImageModalOpen}
          />
        </label>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center relative"
      >
        <input
          ref={inputRef}
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
          disabled={isFilesModalOpen || isImageModalOpen}
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
