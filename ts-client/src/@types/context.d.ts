import { Socket } from "socket.io-client"
import { ReactNode, Dispatch } from "react"
import { JwtPayload } from "jwt-decode";
import { BaseUser } from "./user";

export interface ContextProps {
  children?: ReactNode
};

export type SocketContextType = {
  socket: Socket | null,
};

export type LoginType = {
  email: string,
  password: string
}

export type RegisterType = {
  email: string,
  username: string,
  password: string
}

export type AuthContextType = {
  user: BaseUser | null,
  authToken: string | null,
  logoutUser: () => void,
  loginUser: ({ email, password }: LoginType) => void,
  setAuthToken: (input: string) => void,
  setUser: (input: BaseUser) => void,
  registerUser: ({ email, password, usernmame} : RegisterType) => void,
}