import React from "react";
import socket from "../../Context/LoadSocket.js";
import { useDispatch, useSelector } from "react-redux";
import { closeImageModal } from "../../Store/Chat/chatForm.js";
import { toast } from "react-toastify";
import SocketContext from "../../Context/LoadSocket.js";

function ImageModal({ image, setImage }) {
    const user = useSelector((state) => state.chat.openedChat.user);
    const dispatch = useDispatch();
  const sendImage = async () => {
      if (SocketContext.getSocket().connected) {
        SocketContext.getSocket().emit("new-message-image", {
          file: image,
          name: image.name,
          receiver: user._id,
        });
        dispatch(closeImageModal());
        setImage(null);
      } else {
        toast.error("Connection Lost! Please refresh the page", {
          theme: "dark",
        });
      }
  };
  return (
    <div
      className="w-full max-w-[350px] h-[250px] max-h-[250px] overflow-hidden absolute -top-[260px]
        bg-primary-700 rounded-[20px] shadow-lg border border-primary-500 z-50"
    >
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={URL.createObjectURL(image)}
          alt="image"
          className="max-w-[90%] max-h-[90%] object-contain"
        />
      </div>
      <button
        type="button"
        onClick={sendImage}
        className="w-[48px] h-[48px] rounded-full
            flex justify-center items-center transition-all group
            absolute bottom-0 right-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-tertiary-500 transition-all group-hover:fill-quaternary-500"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  );
}

export default ImageModal;