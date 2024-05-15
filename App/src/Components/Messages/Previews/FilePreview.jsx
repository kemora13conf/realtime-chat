import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { AddMessage } from "../../../Store/Chat/index.js";
import { toast } from "react-toastify";

export const generateSize = (size) => {
  if (size < 1000) {
    return `${size} B`;
  } else if (size < 1000000) {
    return `${(size / 1000).toFixed(2)} KB`;
  } else {
    return `${(size / 1000000).toFixed(2)} MB`;
  }
};

function FilePreview({ file, setFiles, isSend, setIsSend }) {
  const user = useSelector((state) => state.chat.openedChat.user);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const closeFile = () => {
    setFiles((prev) => {
      return Array.from(prev).filter((f) => f.name !== file.name);
    });
  };
  useEffect(() => {
    if (isSend) {
      setIsSending(true);
    }
  }, [isSend]);
  useEffect(() => {
    if (isSending) {
      const formData = new FormData();
      formData.append("file", file);
      const response = new XMLHttpRequest();
      response.open(
        "POST",
        `${import.meta.env.VITE_API}/conversations/${
          user.username
        }/message/file`,
        true
      );
      response.setRequestHeader(
        "Authorization",
        `Bearer ${Cookies.get("jwt")}`
      );
      response.upload.onprogress = (e) => {
        setProgress((e.loaded / e.total) * 100);
      };
      response.onload = () => {
        if (response.status === 200 && response.readyState === 4) {
          const res = JSON.parse(response.responseText);
          if (res.type === "success") {
            dispatch(AddMessage(res.data));
            setFiles((prev) => {
              return Array.from(prev).filter((f) => f.name !== file.name);
            });
            setIsSending(false);
          } else {
            toast.error("An error occured while sending the file", {
              theme: "dark",
            });
            setIsSending(false);
            setIsSend(false);
          }
        } else {
          toast.error("An error occured while sending the file", {
            theme: "dark",
          });
          setIsSending(false);
          setIsSend(false);
        }
      };
      response.send(formData);
    }
  }, [isSending]);
  return (
    <div
      key={file.name}
      className="w-full h-fit flex items-start justify-between px-[20px] py-[10px] bg-primary-800 rounded-[10px]
        border border-primary-500 shadow-lg transition-all duration-300 cursor-pointer hover:border-primary-400"
    >
      <div className="w-full flex items-start gap-[15px] text-quaternary-600">
        <i className="fas fa-paperclip pt-[5px]"></i>
        <div className="w-full flex flex-col gap-1">
          <h2 className=" text-[14px] font-medium">
            {file.name.length > 20
              ? file.name.slice(0, 17) + "..." + file.name.slice(-3)
              : file.name}
          </h2>
          {isSending ? (
            <div className="w-full flex flex-col gap-2 transition-all duration-300">
              <span className="text-[12px] text-quaternary-700">
                Progress - {progress} %
              </span>
              <div className="w-full h-[6px] bg-primary-500 rounded-[5px] overflow-hidden">
                <div
                  className="h-full bg-quaternary-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <span className="text-[10px] text-quaternary-700 transition-all duration-300">
              {generateSize(file.size)} - {file.type}
            </span>
          )}
        </div>
      </div>

      <button type="button" onClick={closeFile}>
        <i
          className="fas fa-times text-quaternary-700 transition-all duration-200 
        hover:text-quaternary-500 hover:scale-[1.1] "
        ></i>
      </button>
    </div>
  );
}

export default FilePreview;
