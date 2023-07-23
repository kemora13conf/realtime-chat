import { useContext, useEffect, useState } from "react"
import { AppContext } from "../App"
import User from "./User"
import CurrentUser from "./CurrentUserCard"
import Cookies from 'js-cookie';

export default function SideBar({ openChat, parentWidth }) {
    const { currentUser, openedChat,setOpenedChat, socket } = useContext(AppContext)
    const [ users, setUsers ] = useState([])
    
    // fetch users from `${import.meta.env.VITE_API_URL}/users`
    // setUsers with the response
    async function fetchUsers() {
        fetch(`${import.meta.env.VITE_API}/users/online`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('jwt')}`
                }
            })
            .then(res => res.json())
            .then(data => setUsers(data))
    }

    useEffect(() => {
        socket.on('new-user', async ()=>{
            console.log('new-user')
            await fetchUsers()
        })
        socket.on('user-disconnected', async ()=>{
            await fetchUsers()
        })
        fetchUsers()
    }, [])

    return (
        parentWidth > 600 
        ? <div
            className="w-full min-h-[600px] flex flex-col items-center gap-5 p-4 bg-secondary-500 
            absolute transition-all duration-300 ease-in-out
            @[600px]/home:h-full @[600px]/home:static @[600px]/home:max-w-[300px]">
            <CurrentUser />
            <div className="w-full rounded-xl py-3 max-h-[360px] overflow-y-auto scroll-m-2 px-2">
                { 
                    users.data && 
                    users.data
                        .map((user, index) => {
                            if (index == users.data.length - 1)
                                return <User key={index} index={user._id} user={user} />
                            else
                                return <>
                                        <User key={user._id} index={user._id} user={user} className="mb-5" />
                                        <div key={index} className="w-2/3 h-[1.3px] bg-secondary-400 mx-auto my-2 rounded-md"></div>
                                    </>
                        }) 
                }
            </div>
        </div>
        : <div
            className={`${openedChat ? 'hidden' : ''} w-full min-h-[600px] flex flex-col items-center gap-5 p-4 bg-secondary-500 
            absolute transition-all duration-300 ease-in-out
            @[600px]/home:h-full @[600px]/home:static @[600px]/home:max-w-[300px]`}>
            <CurrentUser />
            <div 
                className="w-full rounded-xl py-3 max-h-[360px] overflow-y-auto scroll-m-2 px-2">
                { 
                    users.data && 
                    users.data
                        .map((user, index) => {
                            if (index == users.data.length - 1)
                                return <User key={index} index={user._id} user={user} />
                            else
                                return <>
                                        <User key={index} index={user._id} user={user} className="mb-5" />
                                        <div className="w-2/3 h-[1.3px] bg-secondary-400 mx-auto my-2 rounded-md"></div>
                                    </>
                        }) 
                }
            </div>
        </div>
    )
}