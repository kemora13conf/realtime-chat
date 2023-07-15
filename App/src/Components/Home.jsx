import { useContext } from "react"
import { AppContext } from "../App"

export default function Home() {
    // get the current user from the context
    const { currentUser } = useContext(AppContext)
    return (
        <div className="w-full min-h-screen bg-primary flex justify-center items-center px-10">
            <div className="w-full max-w-[900px] min-h-[600px] bg-secondary rounded-3xl overflow-hidden flex gap-2 p-2">
                <div className="max-w-[300px] w-full flex flex-col items-center gap-5 p-3">
                    <div className="flex gap-2 w-full flex-col">
                        <div className="flex justify-between w-full items-center">
                            <img
                                src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${currentUser.profilePicture}`}
                                className="w-24 h-24 rounded-full bg-quaternary object-cover object-center shadow-profile" />
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" strokeWidth={1.5} 
                                className="w-[45px] h-[45px] stroke-quaternary cursor-pointer transition-all hover:bg-tertiary p-[10px] rounded-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                        </div>
                        <div className="flex flex-col p-2">
                            <div className="w-auto font-bold text-quaternary" >
                                { currentUser.username }
                            </div>
                            <div className="font-light text-tertiary">
                                { currentUser.email }
                            </div>
                        </div>
                        
                    </div>
                    <div className="w-full bg-quaternary rounded-xl ">
                        <div className="w-full h-3 bg-tertiary rounded-t-xl"></div>
                        <div className="w-full h-3 bg-tertiary rounded-b-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}