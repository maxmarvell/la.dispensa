import { createContext } from "react";
import io, { Socket } from "socket.io-client";
import { useState, useEffect } from "react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://127.0.0.1';

const SocketContext = createContext();
export default SocketContext;

export const SocketProvider = ({ children }) => {

  const [socket, setSocket] = useState(null);

  useEffect(() => {

    const socketIo = io(SOCKET_URL, {
      reconnection: true,
      upgrade: true,
      transports: ["websocket", "polling"],
    })

    setSocket(socketIo);

    return function () {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}