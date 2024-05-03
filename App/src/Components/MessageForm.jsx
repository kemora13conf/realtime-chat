import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export default function MessageForm({ user, setMessages }){
    const [ msg, setMsg ] = useState('')
    function handleSubmit(e){
        e.preventDefault()
        console.log('submited')
        fetch(`${import.meta.env.VITE_API}/messages/${user._id}`,{
            method: 'POST',
            headers: {
                'Authorization': `Bareer ${Cookies.get('jwt')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: currentUser._id,
                receiver: user._id,
                text: msg
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.type == 'success'){
                setMsg('')
                setMessages(prv => [...prv, res.data])
                socket.emit('message', user._id)
            }
        })
    }
    return (
        <form
            onSubmit={handleSubmit} 
            className="w-full flex mt-auto px-5 py-3 gap-3">
            <input 
                type="text" 
                value={msg}
                onChange={e => setMsg(e.target.value)}
                className="w-full h-12 rounded-full bg-secondary-500 px-5 text-tertiary-500 border-solid border-[1.7px] border-transparent outline-none transition-all focus:border-quaternary-500" 
                placeholder="Type a message..." />
            <button 
                type="submit"
                className="min-w-[48px] min-h-[48px] rounded-full bg-primary-500 flex justify-center items-center transition-all group hover:bg-quaternary-500">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 fill-quaternary-500 transition-all group-hover:fill-secondary-500">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
            </button>
        </form>
    )
}