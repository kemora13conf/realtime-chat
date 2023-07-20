import { useContext, useEffect, useState } from "react"
import { AppContext } from "../App"
import User from "./User"
import CurrentUser from "./CurrentUserCard"
import Cookies from 'js-cookie';

export default function SideBar({ openChat }) {
    const { currentUser, setOpenedChat, socket } = useContext(AppContext)
    const [ users, setUsers ] = useState([])
    const [ userAvailable, setUserAvailable ] = useState(false)
    
    // fetch users from `${import.meta.env.VITE_API_URL}/users`
    // setUsers with the response
    useEffect(() => {
        if (socket) {
            console.log('socket: ', socket)
            socket.on('new-user', ()=>{
                console.log('new-user')
                setUserAvailable(prv => !prv)
            })
            socket.on('user-disconnected', ()=>{
                setUserAvailable(prv => !prv)
            })
        }
        fetch(`${import.meta.env.VITE_API}/users/online`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get('jwt')}`
            }
        })
        .then(res => res.json())
        .then(data => setUsers(data))
    }, [userAvailable, socket])

    return (
        
        <div className="max-w-[300px] w-full flex flex-col items-center gap-5 p-4 bg-secondary-500">
            <CurrentUser />
            <div className="w-full rounded-xl py-3 max-h-[360px] overflow-y-auto scroll-m-2 px-2">
                { 
                    users.data && 
                    users.data
                        .map((user, index) => {
                            if (index == users.data.length - 1)
                                return <User key={user._id} user={user} />
                            else
                                return <>
                                        <User key={user._id} user={user} className="mb-5" />
                                        <div className="w-2/3 h-[1.3px] bg-secondary-400 mx-auto my-2 rounded-md"></div>
                                    </>
                        }) 
                }
            </div>
        </div>
    )
}