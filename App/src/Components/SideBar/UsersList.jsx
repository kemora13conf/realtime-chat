import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import socketContext from '../../Context/LoadSocket.js';
import { fetchUsers } from '../../Store/Global/index.js';

function UsersList() {
    const auth = useSelector((state) => state.auth);
    const global = useSelector((state) => state.global);
    const dispatch = useDispatch();
    
    useEffect(() => {
      socketContext.on("new-user", async () => {
        // Add new User
      });
      socketContext.on("user-disconnected", async () => {
        // remove user
      });
        dispatch(fetchUsers(global.usersFilter));
        console.log(global.allUsers)
    }, []);
  return (
    <div className="w-full flex flex-col gap-2">
      {global.allUsers?.map((user) => (
        <div key={user._id} className="flex gap-2 items-center">
          <img
            src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${
              user["profile-picture"]
            }`}
            className="w-12 h-12 rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
          />
          <div className="flex flex-col">
            <div className="font-bold text-quaternary-500 text-lg font-['Montserrat'] ">
              {user.username}
            </div>
            <div className="font-light text-tertiary-500 text-sm font-['Montserrat']">
              {user.email}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersList
