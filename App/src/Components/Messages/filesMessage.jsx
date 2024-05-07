import React from "react";

function FilesMessage({ msg }) {
  return (
    <div className="w-full">
      <div
        className="bg-primary-900 bg-opacity-25 
                  backdrop-blur-md rounded-md shadow-card flex flex-col gap-[10px]"
      >
        {msg.files?.map((file, index) => (
          <a
            key={index}
            href={`${import.meta.env.VITE_ASSETS}/Messages-files/${file}`}
            download
            className="text-quaternary-600 text-[12px] font-light flex items-center gap-[10px] py-[5px] px-[10px]"
          >
            <i className="fas fa-download"></i>{" "}
            {file.substring(0, 5) +
              "..." +
              file.substring(file.length - 5, file.length)}
          </a>
        ))}
      </div>
    </div>
  );
}

export default FilesMessage;
