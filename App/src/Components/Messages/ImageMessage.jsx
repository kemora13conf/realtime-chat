import React from "react";
import { downloadFile } from "../../Helpers/utils.js";
import { generateSize } from "./Previews/FilePreview.jsx";
import { openImage } from "../../Store/Global/index.js";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

function ImageMessage({ msg }) {
  const dispatch = useDispatch();
  return (
    <div className="w-[200px] h-[200px]">
      <img
        onClick={() => {
          dispatch(openImage(msg.content[0]));
        }}
        src={`${
          import.meta.env.VITE_API
        }/conversations/Messages-files/${msg.content[0]._id}?token=${Cookies.get("jwt")}`}
        alt="message"
        className="w-full h-full object-cover rounded-[5px] cursor-pointer
        border-primary-400 shadow-lg transition-all duration-300"
      />
      <div
        className="w-full absolute bottom-0 right-0 bg-primary-800 bg-opacity-40 
                backdrop-blur-md rounded-b-[10px] px-[20px] py-[10px] flex flex-col"
      >
        <h2 className="text-quaternary-500 text-[14px] font-light">
          {msg.content[0].fileName.length > 17
            ? msg.content[0].fileName.substring(0, 14) +
              "..." +
              msg.content[0].fileName.slice(-3)
            : msg.content[0].fileName}
        </h2>
        <span className="text-[10px] text-quaternary-600 mb-[10px]">
          {generateSize(msg.content[0].fileSize)} - {msg.content[0].contentType}
        </span>

        <a
          onClick={() => {
            downloadFile(msg.content[0]._id, msg.content[0].fileName);
          }}
          className="w-full bg-primary-800 text-quaternary-700 text-[12px] font-light 
          flex items-center justify-center gap-[10px] py-[10px] px-[20px] 
          cursor-pointer rounded-[10px]"
        >
          <i className="fas fa-download"></i>
          {msg.content[0].fileName.length > 15
            ? msg.content[0].fileName.substring(0, 11) +
              "..." +
              msg.content[0].fileName.slice(-3)
            : msg.content[0].fileName}
        </a>
      </div>
    </div>
  );
}

export default ImageMessage;
