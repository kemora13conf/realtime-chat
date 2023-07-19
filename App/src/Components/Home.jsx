import { useContext, useEffect, useState } from "react"
import { AppContext } from "../App"
import SideBar from "./SideBar"
import { motion } from "framer-motion" 
import ChatContainer from "./ChatContainer"
import { Manager } from "socket.io-client";

const manager = new Manager(import.meta.env.VITE_SOCKET_URL)

export default function Home() {
    const socketObj = manager.socket('/');
    try {
        manager.open();
    } catch (error) {
        console.log(error)
    }
    // get the current user from the context
    const { currentUser, openedChat, socket, setSocket } = useContext(AppContext)
    socketObj.emit('connection-success', currentUser._id)
    
    useEffect(()=>{
        setSocket(socketObj)
    },[socketObj])
    return (
        <div className="w-full min-h-screen bg-primary-600 flex justify-center items-center px-10">
            <motion.div
                initial={{opacity: 0, scale: 0.5}}
                animate={{opacity: 1, scale: 1}}
                transition={{
                    type: 'tween',
                    duration: 0.3
                }}  
                className="w-full max-w-[900px] min-h-[600px] bg-secondary-600 rounded-3xl shadow-profile overflow-hidden flex">
                <SideBar />
                <ChatContainer id={openedChat} />
                {/* id={'64aad0f6e3037ab7d995f252'} */}
            </motion.div>
        </div>
    )
}