import { RecievedMessage, SentMessage } from "./Message";
import ChatHeader from "./ChatHeader";
import MessageForm from "./MessageForm";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Chat({ user }) {
    const [ messages, setMessages ] = useState([])

    function getMessages (){
        fetch(`${import.meta.env.VITE_API}/messages/${openedChat}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get('jwt')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setMessages(data.data)
        })
    }   
    useEffect(() => {
        // feth all the message from the server from /messages/:id with the id of the current user and posting user's id
        getMessages()

        socket.on('message', () => {
            getMessages()
        })

    },[openedChat]);
    return (
        <>
            <ChatHeader user={user} />
            <div className="w-full h-full max-h-[450px] overflow-y-auto px-5 py-5">    
                <div className="w-full h-fit flex flex-col justify-end items-start gap-2">
                    {
                        messages.map(message => {
                            if(message.sender === currentUser._id){
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