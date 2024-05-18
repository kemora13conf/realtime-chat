import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import SocketContext from "../Context/LoadSocket.js";
import useCall from "../Hooks/useCall.js";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

function Call() {
  const current_user = useSelector((state) => state.auth.user);
  const {
    isCallRinging,
    isCallAccepted,
    user,
    isLoading,
    fetchUser,
    onConnect,
    onDisconnect,
    setIsCallRinging,
    setIsCallAccepted,
    setUser,
  } = useCall();

  const param = useParams();

  useEffect(() => {
    if (current_user && user) {
      if (SocketContext.socket && SocketContext.socket.connected) {
        onConnect();
      } else {
        SocketContext.getSocket().on("connect", () => {
          onConnect();
        });
      }
    } else {
      fetchUser(param.id);
    }

    return () => {
      if (user) {
        onDisconnect();
      }
    };
  }, [current_user, user]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      key={current_user?._id}
      className="w-full min-h-[calc(100svh-40px)] flex flex-col items-stretch overflow-y-auto bg-secondary-700
            rounded-[20px] shadow-lg border border-primary-500"
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        {/* User image with big circle under it with pulse animation */}
        <div
          className="w-[450px] h-[450px] 
            rounded-full bg-primary-500 bg-opacity-30 
            flex items-center justify-center"
        >
          <div
            className="w-[350px] h-[350px] 
            rounded-full bg-secondary-600 bg-opacity-30 
            flex items-center justify-center"
          >
            <div
              className="w-[200px] h-[200px] 
            rounded-full bg-secondary-500 bg-opacity-30 
            flex items-center justify-center"
            >
              <img
                src={`${import.meta.env.VITE_API}/users/${
                  user?._id
                }/profile-picture?token=${Cookies.get("jwt")}`}
                alt="user"
                className="w-[120px] h-[120px] rounded-full"
              />
            </div>
          </div>
        </div>
        {/* button */}
        <div
          className="absolute bottom-10 w-full 
            flex items-center justify-center flex-col gap-[20px]"
        >
          <div className="w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold text-quaternary-500">
              {user?.username}
            </h1>
            {/* calling or ringing */}
            <h1 className="text-xl font-bold text-quaternary-500">
              {isCallRinging ? "Ringing..." : "Calling"}
              {isCallAccepted ? "Connected" : ""}
            </h1>
          </div>
          <button
            onClick={onDisconnect}
            className="w-[60px] h-[60px] 
            bg-red-500 text-quaternary-500 font-bold text-lg
            flex items-center justify-center rounded-full shadow-profile
            transition-all duration-300 ease-in-out
            hover:bg-red-600 hover:scale-110 hover:shadow-lg"
          >
            <i className="fas fa-phone"></i>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Call;
