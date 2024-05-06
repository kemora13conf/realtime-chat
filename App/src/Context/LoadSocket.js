import React, { useEffect } from "react";
import { Manager } from "socket.io-client";
import Cookies from "js-cookie";

const manager = new Manager(import.meta.env.VITE_SOCKET_URL,
    {
        auth: {
            token: Cookies.get("jwt"),
        },
    }
);

const socket = manager.socket("/");

export default socket;
