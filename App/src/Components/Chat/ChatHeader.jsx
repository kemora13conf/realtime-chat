import { useSelector } from "react-redux";

const ChatHeader = () => {
  const user = useSelector((state) => state.chat.openedChat.user);
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
          {`Last seen ${new Date(user.last_seen).toLocaleTimeString()}`}
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
