import { useContext, useEffect, useState } from "react"
import EmptyChat from "./EmptyChat"
import Loading from "./Loading"
import { AppContext } from "../App"
import Chat from "./Chat"
import { motion } from "framer-motion"
import Cookies from "js-cookie"

export default function ChatContainer(){
    const { openedChat } = useContext(AppContext)
    const [ user, setUser ] = useState({})
    const [ loaded, setLoaded ] = useState(false)

    useEffect(() => {
        if(openedChat){
            console.log(openedChat)
            fetch(`${import.meta.env.VITE_API}/users/${openedChat}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('jwt')}`
                }
            })
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
            className="flex flex-col w-full">
            {
                !openedChat
                ? <EmptyChat />
                : <Chat user={user} />
            }
        </motion.div>

    )
}

