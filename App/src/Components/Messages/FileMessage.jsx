import React from "react";
import { downloadFile } from "../../Helpers/utils.js";
import { generateSize } from "./Previews/FilePreview.jsx";
import Cookies from "js-cookie";

function FileMessage({ msg }) {
  return (
    <div className="w-max">
      <div className="bg-opacity-25 flex flex-col gap-[15px] px-[5px]">
        {msg.content?.map((file, index) => (
          <div key={index} className="w-full flex flex-col gap-[20px]">
            <div className="w-full flex items-start gap-[15px]">
              <div
                className="min-w-[40px] max-w-[40px] aspect-square rounded-full overflow-hidden 
                bg-primary-800 flex items-center justify-center"
              >
                {file.contentType.includes("image") ? (
                  <img
                    src={`${
                      import.meta.env.VITE_API
                    }/conversations/Messages-files/${file._id}?token=${Cookies.get(
                      "jwt"
                    )}`}
                    alt="message"
                    className="w-full h-full object-cover rounded-[5px]"
                  />
                ) : (
                  <i
                    className="fas fa-paperclip 
                    text-tertiary-600 text-[16px]
                    "
                  ></i>
                )}
              </div>
              <div className="w-max flex flex-col gap-[5px]">
                <h2 className="text-quaternary-600 text-[14px] font-light cursor-pointer whitespace-nowrap">
                  {file.fileName.length > 17
                    ? file.fileName.substring(0, 14) +
                      "..." +
                      file.fileName.slice(-3)
                    : file.fileName}
                </h2>
                <span className="text-[10px] text-quaternary-700 whitespace-normal">
                  {generateSize(file.fileSize)} - {file.contentType}
                </span>
              </div>
            </div>
            <div className="w-full flex items-center">
              <a
                onClick={() => {
                  downloadFile(file._id, file.fileName);
                }}
                className="w-full bg-primary-800 text-quaternary-700 text-[12px] font-light 
                flex items-center justify-center gap-[10px] py-[10px] px-[20px] cursor-pointer rounded-[10px] border 
                border-primary-500 shadow-lg transition-all duration-300 hover:border-primary-400"
              >
                <i className="fas fa-download"></i>
                {file.fileName.length > 17
                  ? file.fileName.substring(0, 14) +
                    "..." +
                    file.fileName.slice(-3)
                  : file.fileName}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileMessage;
