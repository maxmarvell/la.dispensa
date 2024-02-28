export interface BaseUser {
  username: string,
  id: string,
  email: string,
}

export interface BaseConnection {
  connectedWithId: string,
  connectedById: string,
  accepted: boolean
}


export interface UserType extends BaseUser {
  image?: string,
  connectedWith: ConnectionType[],
  connectedBy: ConnectionType[],
}

export interface ConnectionType extends BaseConnection {
  connectedWith: UserType,
  connectedBy: UserType
}


export type PermissionUserPropsType = {
  user: UserType,
  selectedUser: UserType | null,
  setSelectedUser
}