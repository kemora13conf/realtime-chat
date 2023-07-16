export default function EmptyChat (){
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="font-bold text-tertiary-400">
                No chat opened!
            </div>
            <div className="font-light text-center text-tertiary-500 max-w-[300px]">
                tap on a user in the side bar to start a conversation.
            </div>
        </div>
    )
}