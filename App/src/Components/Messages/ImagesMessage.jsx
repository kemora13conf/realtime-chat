import React from "react";

function ImagesMessage({ msg }) {
  return (
    <div className="w-[200px] h-[200px] relative">
      <img
        src={`${import.meta.env.VITE_ASSETS}/Messages-files/${msg.image}`}
        alt="message"
        className="w-full h-full object-cover rounded-[5px]"
      />
      <div
        className="absolute bottom-0 right-0 bg-primary-700 bg-opacity-25 
                backdrop-blur-md rounded-md shadow-card"
      >
        <a
          href={`${import.meta.env.VITE_ASSETS}/Messages-files/${msg.image}`}
          download
          className="text-quaternary-600 text-[12px] font-light flex items-center gap-[10px] py-[5px] px-[10px]"
        >
          <i className="fas fa-download"></i>{" "}
          {msg.image.substring(0, 5) +
            "..." +
            msg.image.substring(msg.image.length - 5, msg.image.length)}
        </a>
      </div>
    </div>
  );
}

export default ImagesMessage;
