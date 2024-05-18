import React, { useState } from "react";
import Cookies from "js-cookie";
import SocketContext from "../Context/LoadSocket.js";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

function useCall() {
  const [isCallRinging, setIsCallRinging] = useState(false);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchUser = async (id) => {
    setIsLoading(true);
    const response = await fetch(`${import.meta.env.VITE_API}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    const res = await response.json();
    if (res.type === "success") {
      setUser(res.data);
    }
    setIsLoading(false);
  };

  const onConnect = () => {
    SocketContext.socket.emit("call", user._id);
    SocketContext.socket.on("call-ringing", () => {
      setIsCallRinging(true);
    });
    SocketContext.socket.on("call-accepted", () => {
      setIsCallAccepted(true);
    });
    SocketContext.socket.on("end-call", () => {
      navigate(`/conversation/${user._id}`);
    });
  };

  const onDisconnect = () => {
    SocketContext.socket.emit("end-call", user._id);
    SocketContext.socket.off("call-accepted");
    SocketContext.socket.off("end-call");
    SocketContext.socket.off("call");
  };

  return {
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
    setIsLoading,
  };
}

export default useCall;
