import React, { useEffect } from "react";
import { Manager } from "socket.io-client";
import Cookies from "js-cookie";

export default class SocketContext {
  static socket = null;

  static getSocket() {
    if (this.socket == null || !this.socket.connected) {
      let manager = new Manager(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
      this.socket = manager.socket("/");
    }
    return this.socket;
  }
}
