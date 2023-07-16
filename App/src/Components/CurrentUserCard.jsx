import { useContext } from "react"
import { AppContext } from "../App"

export default function Card(){
    const { currentUser, setIsAuth } = useContext(AppContext)
    const signOut = () => {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - 1);
        document.cookie = `jwt=;expires=${expirationDate};path=/`
        setIsAuth(false)
    }
    return (
        <div className="flex gap- w-full flex-col px-6 py-3 bg-secondary-600 rounded-xl shadow-profile">
            <div className="flex justify-between w-full items-center">
                <img
                    src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${currentUser.profilePicture}`}
                    className="w-24 h-24 rounded-full bg-quaternary-500 object-cover object-center shadow-profile" />
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" strokeWidth={1.5} 
                    onClick={signOut}
                    className="w-[45px] h-[45px] stroke-quaternary-500 cursor-pointer transition-all hover:bg-tertiary-500 p-[10px] rounded-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
            </div>
            <div className="flex flex-col p-2">
                <div className="w-auto font-bold text-quaternary-500" >
                    { currentUser.username }
                </div>
                <div className="font-light text-tertiary-500">
                    { currentUser.email }
                </div>
            </div>
        </div>
    )
}