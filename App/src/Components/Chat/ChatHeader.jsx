import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { USER_STATUS, setUserStatus } from "../../Store/Chat/index.js";
import SocketContext from "../../Context/LoadSocket.js";

const ChatHeader = () => {
  const user = useSelector((state) => state.chat.openedChat.user);
  const dispatch = useDispatch();
  const checkUserStatus = () => {
    fetch(`${import.meta.env.VITE_API}/users/${user._id}/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(
          setUserStatus(
            data.data.online ? USER_STATUS.ONLINE : USER_STATUS.OFFLINE
          )
        );
      })
      .catch((error) => {
        dispatch(setUserStatus(USER_STATUS.OFFLINE));
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    checkUserStatus();
    SocketContext.getSocket().on("new-user-connected", (data) => {
      if (data.userId == user._id) {
        dispatch(setUserStatus(USER_STATUS.ONLINE));
      }
    });
    SocketContext.getSocket().on("user-disconnected", (data) => {
      if (data.userId == user._id) {
        dispatch(setUserStatus(USER_STATUS.OFFLINE));
      }
    });
    return () => {};
  }, []);
  return (
    <div className="w-full h-fit flex items-center p-5 bg-secondary-800 rounded-t-[20px]">
      <img
        src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${
          user["profile-picture"]
        }`}
        className="w-[44px] h-[44px] rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
      />
      <div className="flex flex-col ml-5">
        <div className="font-bold text-quaternary-500 text-lg font-['Montserrat'] ">
          {user.username}
        </div>
        <div className="font-light text-quaternary-700 text-xs font-['Montserrat']">
          {/* last seen */}
          {user.status == USER_STATUS.ONLINE
            ? USER_STATUS.ONLINE
            : `Last seen ${new Date(user.last_seen).toLocaleTimeString()}`}
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;