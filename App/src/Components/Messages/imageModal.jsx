import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeImageModal } from "../../Store/Chat/chatForm.js";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AddMessage } from "../../Store/Chat/index.js";
import {motion} from "framer-motion";

function ImageModal({ image, setImage }) {
    const user = useSelector((state) => state.chat.openedChat.user);
    const dispatch = useDispatch();
  const sendImage = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("sender", user._id);
    formData.append("receiver", user._id);
    const response = await fetch(
      `${import.meta.env.VITE_API}/conversations/${user.username}/message/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: formData,
      }
    );
    if (response.ok) {
      const res = await response.json();
      if (res.type == "success") {
        dispatch(AddMessage(res.data));
        setImage(null);
        dispatch(closeImageModal());
      }
    } else {
      toast.error("Failed to send image");
    }
  };
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      key="image-modal"
      className="w-full max-w-[300px] h-[250px] max-h-[250px] overflow-hidden absolute -top-[260px]
        bg-primary-700 rounded-[20px] shadow-lg border border-primary-500 z-50"
    >
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={URL.createObjectURL(image)}
          alt="image"
          className="max-w-[90%] max-h-[90%] object-contain"
        />
      </div>
      {/* close button */}
      <button
        type="button"
        onClick={() => {
          setImage(null);
          dispatch(closeImageModal());
        }}
        className="w-[48px] h-[48px] rounded-full
            flex justify-center items-center transition-all group
            absolute top-0 right-0"
      >
        <i className="fas fa-close text-tertiary-500 text-2xl transition-all group-hover:text-quaternary-500"></i>
      </button>
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
    </motion.div>
  );
}

export default ImageModal;
