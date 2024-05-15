import { useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import SocketContext from "../Context/LoadSocket.js";

export default function useChat() {
  const current_user = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesFetching, setIsMessagesFetching] = useState(true);

  const fetchMessages = async (id) => {
    setIsMessagesFetching(true);
    const response = await fetch(
      `${import.meta.env.VITE_API}/conversations/${id}/messages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      }
    );
    const res = await response.json();
    if (res.type === "success") {
      setMessages(res.data.messages);
    }
    setIsMessagesFetching(false);
  };

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

  const AddMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  const updateMessageStatusToSeen = (message) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg._id === message._id) {
          msg.status = "SEEN";
        }
        return msg;
      })
    );
  };
  const updateMessageStatusToDelivered = (message) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg._id === message._id && msg.status !== "SEEN") {
          msg.status = "DELIVERED";
        }
        return msg;
      })
    );
  };

  const onNewMessage = (message) => {
    /**
     * Check if the message is for the current chat
     * if so add it to the opened chat messages
     */

    if (message.conversation === user?.conversation._id) {
      if (message.sender._id === user?._id) {
        if (message.receiver._id === current_user?._id) {
            AddMessage(message);

          /**
           * Emit Seen event to the server to update the message status
           */
          if (message.status !== "SEEN") {
            SocketContext.socket.emit("message-seen", message);
          }
        }
      }
    }
  };

  const onMessageSeen = (message) => {
    /**
     * Check if the message is for the current chat
     * if so update the message status
     */
    if (message.conversation === user?.conversation._id) {
      if (message.sender._id === current_user?._id) {
        if (message.receiver._id === user?._id) {
          updateMessageStatusToSeen(message);
        }
      }
    }
  };

  const onMessageDelivered = (message) => {
    /**
     * Check if the message is for the current chat
     * if so update the message status
     */
    if (message.conversation === user?.conversation._id) {
      if (message.sender._id === current_user?._id) {
        if (message.receiver._id === user?._id) {
          updateMessageStatusToDelivered(message);
        }
      }
    }
  };

  const onConnect = () => {
    SocketContext.socket.on("new-message", onNewMessage);
    SocketContext.socket.on("message-seen", onMessageSeen);
    SocketContext.socket.on("message-delivered", onMessageDelivered);
  };

  const onDisconnect = () => {
    SocketContext.socket.off("new-message", onNewMessage);
    SocketContext.socket.off("message-seen", onMessageSeen);
    SocketContext.socket.off("message-delivered", onMessageDelivered);
  };

  return {
    fetchMessages,
    fetchUser,
    user,
    messages,
    AddMessage,
    isLoading,
    isMessagesFetching,
    setUser,
    setMessages,
    setIsLoading,
    setIsMessagesFetching,
    onConnect,
    onDisconnect,
  };
}
