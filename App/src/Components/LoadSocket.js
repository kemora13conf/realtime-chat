import React, { useEffect } from "react";
import { Manager } from "socket.io-client";

const manager = new Manager(import.meta.env.VITE_SOCKET_URL);

const socketContext = manager.socket("/");

try {
    socketContext.open();
} catch (error) {
    console.error(error);
}

export default socketContext;
