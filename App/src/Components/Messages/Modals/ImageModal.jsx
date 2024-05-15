import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeImageModal } from "../../../Store/Chat/chatForm.js";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AddMessage } from "../../../Store/Chat/index.js";
import { motion } from "framer-motion";
import SendButton from "../Pieces/SendButton.jsx";
import { generateSize } from "../Previews/FilePreview.jsx";

function ImageModal({ image, setImage }) {
  const user = useSelector((state) => state.chat.openedChat.user);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const closeImage = () => {
    setImage(null);
    dispatch(closeImageModal());
  };
  const sendImage = async () => {
    setIsSending(true);
    const formData = new FormData();
    formData.append("image", image);
    const response = new XMLHttpRequest();
    response.open(
      "POST",
      `${import.meta.env.VITE_API}/conversations/${user.username}/message/image`,
      true
    );
    response.setRequestHeader("Authorization", `Bearer ${Cookies.get("jwt")}`);
    response.upload.onprogress = (e) => {
      setProgress((e.loaded / e.total) * 100);
    };
    response.onload = () => {
      if (response.status === 200 && response.readyState === 4) {
        const res = JSON.parse(response.responseText);
        if (res.type === "success") {
          dispatch(AddMessage(res.data));
          setImage(null);
          dispatch(closeImageModal());
        } else {
          toast.error("An error occured while sending the file", {
            theme: "dark",
          });
        }
      } else {
        toast.error("An error occured while sending the file", {
          theme: "dark",
        });
      }
      setIsSending(false);
    };
    response.send(formData);
  };
  useEffect(() => {
    if (image) {
      /**
       * if no image is selected, close the modal
       */
      if (!image) {
        dispatch(closeImageModal());
        setImage(null);
      }
    }
  }, [image]);

  return image ? (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      key="image-modal"
      className={`w-full max-w-[300px] h-[250px] -top-[260px] max-h-[250px] overflow-hidden absolute 
        bg-primary-700 rounded-[20px] shadow-lg border border-primary-500 z-50`}
    >
      <div className="w-full h-[calc(100%-70px)] flex justify-center items-center">
        <img
          src={URL.createObjectURL(image)}
          alt="image"
          className="max-w-[90%] max-h-[90%] object-contain rounded-[10px] transition-all duration-300"
        />
      </div>
      {/* close button */}
      <button
        type="button"
        onClick={closeImage}
        className="w-[48px] h-[48px] rounded-full
            flex justify-center items-center transition-all group
            absolute top-0 right-0 bg-primary-600 bg-opacity-10"
      >
        <i className="fas fa-close text-tertiary-500 text-2xl transition-all group-hover:text-quaternary-500"></i>
      </button>
      <div
        className="absolute bottom-0 left-0 backdrop-blur-md w-full h-fit flex justify-between items-end 
        rounded-b-[20px] transition-all duration-300 "
      >
        <div className="w-full h-full flex flex-col gap-[5px] px-[15px] py-[10px]">
          <h2 className="text-[16px] font-medium text-quaternary-600">
            {image.name.length > 20
              ? image.name.slice(0, 17) + "..." + image.name.slice(-3)
              : image.name}
          </h2>
          {isSending ? (
            <div className="w-full flex flex-col gap-2 transition-all duration-300">
              <span className="text-[12px] text-quaternary-700">
                Progress - {progress} %
              </span>
              <div className="w-full min-h-[6px] bg-primary-500 rounded-[5px] overflow-hidden">
                <div
                  className="h-full bg-quaternary-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <span className="text-[10px] text-quaternary-700 transition-all duration-300">
              {generateSize(image.size)} - {image.type}
            </span>
          )}
        </div>
        <SendButton onClick={sendImage} />
      </div>
    </motion.div>
  ) : (
    (() => {
      dispatch(closeImageModal());
      setImage(null);
      return null;
    })()
  );
}

export default ImageModal;
