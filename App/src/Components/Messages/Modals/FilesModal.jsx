import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeFilesModal } from "../../../Store/Chat/chatForm.js";
import { motion } from "framer-motion";
import FilePreview from "../Previews/FilePreview.jsx";
import SendButton from "../Pieces/SendButton.jsx";

function FilesModal({ files, setFiles }) {
  const user = useSelector((state) => state.chat.openedChat.user);
  const [isSend, setIsSend] = useState(false);
  const dispatch = useDispatch();
  const sendFiles = async () => {
    setIsSend(true);
  };
  useEffect(() => {
    if (files) {
      /**
       * if no files are selected, close the modal
       */
      if (files.length === 0) {
        dispatch(closeFilesModal());
        setFiles(null);
      }
    }
  }, [files]);
  return files ? (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      key="files-modal"
      className="w-full max-w-[300px] h-[250px] max-h-[250px] overflow-hidden absolute -top-[260px]
        bg-primary-700 rounded-[20px] shadow-lg border border-primary-500 z-50
        scroll-pb-[10px] transition-all duration-300"
    >
      <div
        className="w-full h-[100%] flex justify-center items-center absolute 
        top-0 overflow-hidden overflow-y-auto"
      >
        {files && files.length > 0 && (
          <div className="w-full h-full flex flex-col gap-2 p-[10px]">
            {Array.from(files).map((file, index) => (
              <FilePreview
                key={index}
                {...{
                  file,
                  setFiles,
                  isSend,
                  setIsSend,
                }}
              />
            ))}
            <div className="w-full min-h-[60px]"></div>
          </div>
        )}
      </div>
      <div
        className="absolute bottom-0 right-0
        backdrop-blur-md w-full h-[55px] flex justify-end items-center rounded-b-[20px] transition-all duration-300"
      >
        <SendButton onClick={sendFiles} />
      </div>
    </motion.div>
  ) : (
    (() => {
        dispatch(closeFilesModal());
        setFiles(null);
      return null;
    })()
  );
}

export default FilesModal;
