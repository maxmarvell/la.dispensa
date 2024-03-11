import { Socket } from "socket.io-client"
import { ReactNode } from "react"

export interface ContextProps {
  children?: ReactNode
};

export type SocketContextType = {
  socket: Socket | null,
};

export interface LoginType {
  email: string,
  password: string
};

export interface RegisterType extends LoginType {
  username: string,
};

export type UserType = {
  username: string,
  id: string,
  email: string,
};

export type AuthContextType = {
  user: UserType | null,
  authToken: string | null,
  logoutUser: () => void,
  loginUser: ({ email, password }: LoginType) => void,
  setAuthToken: (input: string) => void,
  setUser: (input: UserType) => void,
  registerUser: ({ email, password, username} : RegisterType) => void,
};