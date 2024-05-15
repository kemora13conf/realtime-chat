import Cookies from "js-cookie";
import SettingButton from "./SettingButton.jsx";
import { useSelector } from "react-redux";

export default function Card() {

  const auth = useSelector((state) => state.auth);
  return (
    auth.user && (
      <div className="flex gap-[20px] w-full flex-col mt-[20px]">
        <div className="flex justify-between w-full items-center">
          <img
            src={`${import.meta.env.VITE_API}/users/${
              auth.user._id
            }/profile-picture?token=${Cookies.get("jwt")}`}
            className="w-24 h-24 rounded-full bg-quaternary-500 object-cover object-center shadow-profile"
          />
          <SettingButton />
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
