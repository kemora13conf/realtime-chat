import { useContext, useEffect, useState } from "react"
import useMeasure from 'react-use-measure'
import { AppContext } from "../App"
import SideBar from "./SideBar"
import { motion } from "framer-motion" 
import ChatContainer from "./ChatContainer"

export default function Home() {
    
    const [ref, bounds] = useMeasure()
    // get the current user from the context
    const { currentUser, openedChat, socket, setSocket } = useContext(AppContext)
    useEffect(()=>{
        socket.emit('connection-success', currentUser._id)
    },[])
    return (
        <div className="w-full min-h-screen bg-primary-600 flex justify-center items-center px-5 md:px-10">
            <motion.div
                initial={{opacity: 0, scale: 0.5}}
                animate={{opacity: 1, scale: 1}}
                transition={{
                    type: 'tween',
                    duration: 0.3
                }}  
                ref={ref}
                className="relative w-full max-w-[900px] min-h-[600px] bg-secondary-600 rounded-3xl shadow-profile overflow-hidden flex justify-stretch @container/home">
                <SideBar parentWidth={bounds.width}/>
                <ChatContainer id={openedChat} />
                {/* id={'64aad0f6e3037ab7d995f252'} */}
            </motion.div>
        </div>
    )
}