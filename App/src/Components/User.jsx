import { useContext } from "react"
import { AppContext } from "../App"

export default function User({ user, handleClick }) {
    const { currentUser, setOpenedChat } = useContext(AppContext)
    // return a jsx for user model containing the user's profile picture, username, and last message
    return (
        <div 
            onClick={()=>{
                setOpenedChat(user._id)
            }}
            className="flex gap-2 p-2 rounded-xl cursor-pointer transition-all hover:shadow-card hover:bg-secondary-600 ">
            <img src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${user.profilePicture}`}
                className="w-12 h-12 rounded-full bg-quaternary-500 object-cover object-center shadow-profile" />
            <div className="flex flex-col">
                <div className="font-bold text-quaternary-500">
                    { user.username }
                </div>
                <div className="font-light text-tertiary-500">
                    { user.socket ? 'online' : 'offline' }
                </div>
            </div>
        </div>        
    )
}