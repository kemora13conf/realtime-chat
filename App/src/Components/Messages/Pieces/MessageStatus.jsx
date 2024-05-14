import React from "react";

function MessageStatus({ status }) {
  const MESSAGE_STATUS = {
    SENT: "SENT",
    DELIVERED: "DELIVERED",
    SEEN: "SEEN",
  };
  return (
    <>
      {status === MESSAGE_STATUS.SENT && (
        <span className="text-tertiary-500 font-['Montserrat'] font-light">
          <i className="fas fa-check text-tertiary-500 text-opacity-70"></i>
        </span>
      )}
      {status === MESSAGE_STATUS.DELIVERED && (
        <span className="text-tertiary-500 font-['Montserrat'] font-light">
          <i className="fas fa-check-double text-tertiary-500 text-opacity-70"></i>
        </span>
      )}
      {status === MESSAGE_STATUS.SEEN && (
        <span className="text-tertiary-500 font-['Montserrat'] font-light">
          <i className="fas fa-check-double text-green-500"></i>
        </span>
      )}
    </>
  );
}

export default MessageStatus;
