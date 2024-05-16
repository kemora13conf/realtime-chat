import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../Store/Auth/index.js";
import { useNavigate } from "react-router-dom";
import SocketContext from "../../../Context/LoadSocket.js";
import { useOutsideClickHook } from "../../../Hooks/useOutsideClickHook.js";

function SettingButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);

  useOutsideClickHook(ref, () => {
    setIsMenuOpen(false);
  });

  const signOut = () => {
    SocketContext.getSocket().disconnect();
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div
      className={`flex items-end flex-col gap-[20px]
      relative`}
    >
      <button
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
        className="text-tertiary-500 font-light self-start flex gap-[10px] items-center
        px-[15px] py-[7px] bg-primary-500 overflow-hidden
        border border-secondary-500 shadow-lg hover:bg-primary-600
        transition-all duration-200 ease-in-out rounded-full"
      >
        <p className="font-light text-tertiary-500 text-sm font-['Montserrat']">
          Settings
        </p>
        <i className="fa-solid fa-gear"></i>
      </button>
      <AnimatePresence mode="out-in">
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            ref={ref}
            className="w-[250px] h-fit absolute z-50 top-[44px]
            bg-primary-500 overflow-hidden
            border border-secondary-500 shadow-lg
            rounded-[18px]"
          >
            <div
              className="w-full h-full flex flex-col gap-[10px] justify-start items-start
          p-[10px]"
            >
              <Link
                to={"/profile"}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className="text-quaternary-600 font-light flex gap-[10px] items-center
                  px-[20px] py-[10px] transition-all duration-300
                  w-full rounded-[8px] bg-primary-600 hover:bg-primary-700
                  border border-secondary-600 hover:border-secondary-500"
              >
                <i className="fa-solid fa-user"></i>
                <p className="font-light text-quaternary-600 text-sm font-['Montserrat']">
                  Profile
                </p>
              </Link>
              <button
                onClick={signOut}
                className="text-quaternary-600 font-light flex gap-[10px] items-center
                px-[20px] py-[10px] transition-all duration-300
                w-full rounded-[8px] bg-primary-600 hover:bg-primary-700
                border border-secondary-600 hover:border-secondary-500"
              >
                <i className="fa-solid fa-sign-out"></i>
                <p className="font-light text-quaternary-600 text-sm font-['Montserrat']">
                  Log Out
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SettingButton;
