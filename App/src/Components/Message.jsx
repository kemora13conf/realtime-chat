function RecievedMessage ({ user, msg }){
    // return a message div
    
    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-500">
                <img
                    className="w-full h-full rounded-full shadow-profile cursor-pointer" 
                    src={`${import.meta.env.VITE_ASSETS}Profile-pictures/${user.profilePicture}`} />
            </div>
            <div 
                className="relative flex flex-col gap-0 mt-1
                            rounded-xl rounded-tl-lg 
                            bg-quaternary-500 
                            px-5 py-2 min-w-[200px] 
                            after:w-4
                            after:h-4 after:rotate-45 after:absolute 
                            after:bg-quaternary-500 after:rounded-sm
                            after:-left-[7px] cursor-pointer">
                <div className="flex gap-1 text-secondary-500">
                    {msg.text}
                </div>
                <div className="flex gap-1 text-secondary-500 font-light text-[13px] ml-auto">
                    { new Date(msg.createdAt).toLocaleTimeString() }
                </div>
            </div>
        </div>
    )
}

function SentMessage ({ user, msg }){
    // return a message div
    
    return (
        <div className="flex gap-4 flex-row-reverse ml-auto">
            <div className="w-10 h-10 rounded-full bg-primary-500">
                <img
                    className="w-full h-full rounded-full shadow-profile cursor-pointer" 
                    src={`${import.meta.env.VITE_ASSETS}Profile-pictures/${user.profilePicture}`} />
            </div>
            <div 
                className="flex flex-col gap-0 mt-1
                            rounded-xl rounded-tl-lg 
                            bg-secondary-500 
                            px-5 py-2 min-w-[200px] 
                            after:w-4
                            after:h-4 after:rotate-45 after:absolute 
                            after:bg-secondary-500 after:rounded-sm
                            after:-right-[6px] cursor-pointer">
                <div className="flex gap-1 text-quaternary-500">
                    {msg.text}
                </div>
                <div className="flex gap-1 text-quaternary-500 font-light text-[13px] ml-auto"> 
                    { new Date(msg.createdAt).toLocaleTimeString() }
                </div>
            </div>
        </div>
    )
}

export { RecievedMessage, SentMessage }