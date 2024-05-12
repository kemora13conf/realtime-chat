import React from "react";

function ImagesMessage({ msg }) {
  return (
    <div className="w-[200px] h-[200px] relative">
      <img
        src={`data:${msg.content.contentType};base64,${msg.content[0].message}`}
        alt="message"
        className="w-full h-full object-cover rounded-[5px]"
      />
      <div
        className="absolute bottom-0 right-0 bg-primary-700 bg-opacity-25 
                backdrop-blur-md rounded-md shadow-card"
      >
        <a
          href={`${import.meta.env.VITE_API}/conversations/Messages-files/${
            msg.content[0]._id
          }`}
          download
          className="text-quaternary-600 text-[12px] font-light flex items-center gap-[10px] py-[5px] px-[10px]"
        >
          <i className="fas fa-download"></i>
          {msg.content[0].fileName.length > 20
            ? msg.content[0].fileName.substring(0, 17) +
              "..." +
              msg.content[0].fileName.slice(-3)
            : msg.content[0].fileName}
        </a>
      </div>
    </div>
  );
}

export default ImagesMessage;
