import React from "react";

function FilesMessage({ msg }) {
  return (
    <div className="w-full">
      <div
        className="bg-primary-900 bg-opacity-25 
                  backdrop-blur-md rounded-md shadow-card flex flex-col gap-[10px]"
      >
        {msg.content?.map((file, index) => (
          <a
            key={index}
            href={`${import.meta.env.VITE_ASSETS}/Messages-files/${file._id}`}
            download
            className="text-quaternary-600 text-[12px] font-light flex items-center gap-[10px] py-[5px] px-[10px]"
          >
            <i className="fas fa-download"></i>
            {file.fileName.length > 20
              ? file.fileName.substring(0, 17) +
                "..." +
                file.fileName.slice(-3)
              : file.fileName}
          </a>
        ))}
      </div>
    </div>
  );
}

export default FilesMessage;
