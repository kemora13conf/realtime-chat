import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Store/Auth/index.js";
import { useNavigate } from "react-router-dom";
import SocketContext from "../../Context/LoadSocket.js";
import Cookies from "js-cookie";


export default function Card() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const signOut = () => {
    SocketContext.getSocket().disconnect();
    dispatch(logout());
    navigate("/login");
  };

  const auth = useSelector((state) => state.auth);
  return (
    auth.user && (
      <div className="flex gap-[20px] w-full flex-col mt-[20px]">
        <div className="flex justify-between w-full items-center">
          <img
            src={`${import.meta.env.VITE_API}/users/${auth.user._id}/profile-picture?token=${Cookies.get("jwt")}`}
            className="w-24 h-24 rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
          />
          <button
            onClick={()=>{}}
            className="text-tertiary-500 font-light flex gap-[10px] items-center
            px-[15px] py-[7px] rounded-full 
            bg-primary-500 hover:bg-primary-600
            border border-secondary-500 shadow-lg hover:border-primary-400
            transition-all duration-200 ease-in-out"
          >
            <p className="font-light text-tertiary-500 text-sm font-['Montserrat']">
              Settings
            </p>
            <i className="fa-solid fa-gear"></i>
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
    )
  );
}
