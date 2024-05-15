import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import SocketContext from "../../Context/LoadSocket.js";
import { Link } from "react-router-dom";

export const USER_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
};

const ChatHeader = ({ user }) => {
  const [userStatus, setUserStatus] = useState(USER_STATUS.OFFLINE);

  const checkUserStatus = () => {
    fetch(`${import.meta.env.VITE_API}/users/${user?._id}/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserStatus(
          data.data.online ? USER_STATUS.ONLINE : USER_STATUS.OFFLINE
        );
      })
      .catch((error) => {
        setUserStatus(USER_STATUS.OFFLINE);
        console.error("Error:", error);
      });
  };
  const onNewUserConnected = (data) => {
    if (data.userId == user?._id) {
      setUserStatus(USER_STATUS.ONLINE);
    }
  };
  const onUserDisconnected = (data) => {
    if (data.userId == user?._id) {
      setUserStatus(USER_STATUS.OFFLINE);
    }
  };

  const onConnect = () => {
    SocketContext.socket.on("new-user-connected", onNewUserConnected);
    SocketContext.socket.on("user-disconnected", onUserDisconnected);
  };
  const onDisconnect = () => {
    SocketContext.socket.off("new-user-connected", onNewUserConnected);
    SocketContext.socket.off("user-disconnected", onUserDisconnected);
  };

  useEffect(() => {
    if (user) {
      checkUserStatus();
      if (SocketContext.socket && SocketContext.socket.connected) {
        onConnect();
      } else {
        SocketContext.getSocket().on("connect", onConnect);
      }
    }
    return () => {
      if (SocketContext.socket && SocketContext.socket.connected) {
        onDisconnect();
      }
    };
  }, []);

  return user == null ? null : (
    <div className="w-full h-fit flex items-center p-5 gap-[20px] bg-secondary-800 rounded-t-[20px]">
      <Link
        to="/"
        className="w-[40px] h-[40px] rounded-full 
        flex items-center justify-center transition-all duration-300 ease-in-out 
        hover:scale-110 hover:shadow-lg"
      >
        <i className="fas fa-arrow-left text-quaternary-600 text-xl" />
      </Link>
      <img
        src={`${import.meta.env.VITE_API}/users/${
          user._id
        }/profile-picture?token=${Cookies.get("jwt")}`}
        className="w-[44px] h-[44px] rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
      />
      <div className="flex flex-col">
        <div className="font-bold text-quaternary-500 text-lg font-['Montserrat'] ">
          {user.username}
        </div>
        <div className="font-light text-quaternary-700 text-xs font-['Montserrat']">
          {/* last seen */}
          {userStatus == USER_STATUS.ONLINE
            ? USER_STATUS.ONLINE
            : `Last seen ${new Date(user.last_seen).toLocaleTimeString()}`}
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
