import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function ChatContainer({ bounds }) {
  const chat = useSelector((state) => state.chat.openedChat.user);
  return (
    <motion.div
      initial={{ x: 500 }}
      animate={{ x: 0 }}
      exit={{ x: 500 }}
      className={`w-full
        ${bounds.width > 720 ? "flex" : chat ? "flex" : "hidden"}
         items-stretch py-[20px] md:p-[20px] max-h-screen
        `}
    >
      <Outlet />
    </motion.div>
  );
}
