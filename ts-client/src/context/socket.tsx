import { createContext } from "react";
import io, { Socket } from "socket.io-client";
import { useState, useEffect } from "react";

// custom types
import { SocketContextType, ContextProps } from "../@types/context";

// socket global
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://127.0.0.1';

const SocketContext = createContext<SocketContextType | null>(null);
export default SocketContext;

export const SocketProvider = ({ children }: ContextProps) => {

  const [socket, setSocket] = useState<Socket | null>(null);

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