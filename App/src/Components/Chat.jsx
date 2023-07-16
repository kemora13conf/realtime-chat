import { useContext, useEffect, useState } from "react"
import EmptyChat from "./EmptyChat"
import Loading from "./Loading"
import { AppContext } from "../App"
import { motion } from "framer-motion"

export default function Chat(){
    const { openedChat } = useContext(AppContext)
    const [ user, setUser ] = useState({})
    const [ loaded, setLoaded ] = useState(false)

    useEffect(() => {
        if(openedChat){
            fetch(`${import.meta.env.VITE_API}/users/${openedChat}`)
            .then(res => res.json())
            .then(data => {
                setUser(data.data)
                setLoaded(true)
            })
            .catch(err => {
                setLoaded(true)
            })
        } else setLoaded(true)
    }, [openedChat])

    if (!loaded) {
        console.log(openedChat)
        return <Loading></Loading>
    }
    return (
        <motion.div 
            initial={{opacity: 0, blur: '10px'}}
            animate={{opacity: 1, blur: '0px'}}
            transition={{
                type: 'tween',
                duration: 2
            }} 
            className="flex flex-col w-full overflow-hidden">
            {
                !openedChat
                ? <EmptyChat />
                : <ChatHeader user={user} />
            }
        </motion.div>

    )
}

const ChatHeader = ({ user }) => {
    const { setOpenedChat } = useContext(AppContext)
    return (
        <div className="w-full flex justify-between items-center h-[80px] bg-secondary-500 px-5">
            <div className="flex items-center gap-2">
                <img src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${user.profilePicture}`}
                    className="w-12 h-12 rounded-full bg-quaternary-500 object-cover object-center shadow-profile" />
                <div className="flex flex-col">
                    <div className="font-bold text-quaternary-500">
                        { user.username }
                    </div>
                    <div className="font-light text-tertiary-500">
                        { "something" }
                    </div>
                </div>
            </div>
            <div
                onClick={()=>{setOpenedChat(null)}} 
                className="flex items-center relative flex-col w-10 h-10 justify-center rounded-full transition-all hover:bg-primary-500 cursor-pointer">
                <div className="absolute w-5 h-[2px] rounded-full bg-quaternary-500 rotate-45"></div>
                <div className="absolute w-5 h-[2px] rounded-full bg-quaternary-500 -rotate-45"></div>
            </div>
        </div>
    )
}