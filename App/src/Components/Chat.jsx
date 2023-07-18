import { RecievedMessage, SentMessage } from "./Message";
import ChatHeader from "./ChatHeader";
import MessageForm from "./MessageForm";
import { AppContext } from "../App";
import { useContext, useEffect, useState } from "react";

export default function Chat({ user }) {
    const { currentUser, openedChat, socket } = useContext(AppContext)
    const [ messages, setMessages ] = useState([])

    function getMessages (){
        fetch(`${import.meta.env.VITE_API}/messages/${currentUser._id}/${openedChat}`)
        .then(res => res.json())
        .then(data => {
            setMessages(data.data)
        })
    }
    console.log(messages)
    useEffect(() => {
        // feth all the message from the server from /messages/:id with the id of the current user and posting user's id
        getMessages()
        
        socket.emit('connection-success', currentUser._id)

        socket.on('message', () => {
            getMessages()
        })

    },[openedChat]);
    return (
        <>
            <ChatHeader user={user} />
            <div className="w-full h-full px-5 py-5 max-h-[450px] overflow-y-scroll scroll-m-2">    
                <div className="w-full h-full flex flex-col justify-end items-start gap-2">
                    {
                        messages.map(message => {
                            if(message.sender._id === currentUser._id){
                                return <SentMessage key={message._id} user={ currentUser } msg={message} />
                            } else {
                                return <RecievedMessage key={message._id} user={ user } msg={message} />
                            }
                        })
                    }
                </div>
            </div>
            <MessageForm user={user} setMessages={setMessages} />
        </>
    )
}