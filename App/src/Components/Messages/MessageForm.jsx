import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AddMessage, removeMessage } from "../../Store/Chat/index.js";
import { toast } from "react-toastify";
import { openFilesModal, openImageModal } from "../../Store/Chat/chatForm.js";
import ImageModal from "./imageModal.jsx";
import FilesModal from "./filesModal.jsx";
import SocketContext from "../../Context/LoadSocket.js";
import { AnimatePresence } from "framer-motion";

export default function MessageForm() {
  const currentUser = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.chat.openedChat.user);
  const chatForm = useSelector((state) => state.chatForm);
  const dispatch = useDispatch();

  const [msg, setMsg] = useState("");
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);

  function importFiles(e) {
    if (e.target.files.length > 0) {
      setFiles(e.target.files);
      dispatch(openFilesModal());
    }
  }
  function importImage(e) {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
      dispatch(openImageModal());
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
      if (res.type == 'success') {
        dispatch(AddMessage(res.data));
      }
    } else {
      toast.error("Failed to send message");
    }

  }
  useEffect(() => {
    if (SocketContext.socket?.connected) {
      SocketContext.socket.on("new-message", (data) => {
        dispatch(AddMessage(data));
      });
    } else {
      SocketContext.getSocket().on("connect", () => {
        SocketContext.socket.on("new-message", (data) => {
          dispatch(AddMessage(data));
        });
      });
    }
  }, []);
  return (
    <div className="w-full flex mt-auto p-[10px] gap-[10px] bg-secondary-800 rounded-b-[20px] relative">
      <AnimatePresence mode="out-in">
        {chatForm.isFilesModalOpen && (
        <FilesModal files={files} setFiles={setFiles} />
      )}
      {chatForm.isImageModalOpen && (
        <ImageModal image={image} setImage={setImage} />
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
            disabled={chatForm.isFilesModalOpen || chatForm.isImageModalOpen}
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
            disabled={chatForm.isFilesModalOpen || chatForm.isImageModalOpen}
          />
        </label>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center relative"
      >
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
          disabled={chatForm.isFilesModalOpen || chatForm.isImageModalOpen}
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
