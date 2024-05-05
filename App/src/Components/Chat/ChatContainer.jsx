import { useEffect, useState } from "react"
import EmptyChat from "./EmptyChat"
import Chat from "./Chat.jsx"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"

export default function ChatContainer(){
    const chat = useSelector((state) => state.chat)
    const dispatch = useDispatch()
    useEffect(() => {
        // fetch the chat messages
    }, [])
    return (
      <motion.div
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        exit={{ x: 500 }}
        className="w-full flex items-stretch p-[20px] max-h-screen"
      >
        {chat.isChatOpen ? <Chat /> : <EmptyChat />}
      </motion.div>
    );
}

