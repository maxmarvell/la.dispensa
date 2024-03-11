import { BaseConnection } from "./connection";

export interface BaseUserType {
  id: string
  username: string
  email: string
  image?: string
}

export interface UserType extends BaseUserType {
  connectedWith?: BaseConnection[]
  connectedBy?: BaseConnection[]
}