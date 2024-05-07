import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeFilesModal } from "../../Store/Chat/chatForm.js";
import SocketContext from "../../Context/LoadSocket.js";
import { toast } from "react-toastify";
import { set } from "react-hook-form";

function FilesModal({ files, setFiles }) {
  const user = useSelector((state) => state.chat.openedChat.user);
  const dispatch = useDispatch();
  const sendFiles = () => {
    let filesArr = Array.from(files);
    let Files = filesArr.map((file) => {
      return {
        name: file.name,
        file: file,
      };
    });
    if (SocketContext.getSocket().connected) {
      SocketContext.getSocket().emit("new-message-file", {
        files: Files,
        receiver: user._id,
      });
      dispatch(closeFilesModal());
      setFiles(null);
    } else {
      toast.error("Connection Lost! Please refresh the page", {
        theme: "dark",
      });
    }
  };
  return (
    <div
      className="w-full max-w-[350px] h-[250px] max-h-[250px] overflow-hidden absolute -top-[260px]
        bg-primary-700 rounded-[20px] shadow-lg border border-primary-500 z-50 overflow-y-auto"
    >
      <div className="w-full h-full flex justify-center items-center">
        {files && files.length > 0 && (
          <div className="w-full h-full flex flex-col gap-2 p-[10px]">
            {Array.from(files).map((file, index) => (
              <div
                key={index}
                className="w-full h-[50px] flex items-center justify-between p-2 bg-primary-800 rounded-[10px]"
              >
                <div className="flex items-center gap-2 text-quaternary-600">
                  <i className="fas fa-paperclip"></i>
                  <p className=" text-[14px] font-light">{file.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = Array.from(files);
                    newFiles.splice(index, 1);
                    setFiles(newFiles);
                  }}
                >
                  <i className="fas fa-times text-quaternary-600"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={sendFiles}
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

export default FilesModal;
