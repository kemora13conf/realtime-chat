import { useContext } from "react"
import { AppContext } from "../App"

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

export default ChatHeader