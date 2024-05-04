import { useDispatch, useSelector } from "react-redux";
import socketContext from "../Context/LoadSocket.js";
import Cookies from 'js-cookie';
import { logout } from "../Store/Auth/index.js";
export default function Card() {
    const dispatch = useDispatch();
    const signOut = () => {
        socketContext.disconnect();
        dispatch(logout());
    }
    
    const auth = useSelector((state) => state.auth);
    return (
      <div className="flex gap-[20px] w-full flex-col mt-[20px]">
        <div className="flex justify-between w-full items-center">
          <img
            src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${
              auth.user["profile-picture"]
            }`}
            className="w-24 h-24 rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
          />
          <button
            onClick={signOut}
            className="px-3 py-2 flex gap-2 items-center mt-auto bg-primary 
                    bg-secondary-700 rounded-md shadow-card text-tertiary-400 
                    transition-all duration-300 hover:bg-secondary-600 hover:text-tertiary-500"
          >
            <i className="fas fa-right-from-bracket"></i>
            Logout
          </button>
        </div>
        <div className="flex flex-col">
          <div className="w-auto font-bold text-quaternary-500 text-xl font-['Montserrat'] ">
            {auth.user.username}
          </div>
          <div className="font-light text-tertiary-500 text-sm font-['Montserrat']">
            {auth.user.email}
          </div>
        </div>
      </div>
    );
}