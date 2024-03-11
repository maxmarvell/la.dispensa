import { BaseUserType } from "@/types/user"

export type UseToggleConnectionProps = {
  userId: string | undefined
}

export type UseToggleConnectionInput = {
  accepted: boolean | undefined
  connectedWith: boolean | undefined
  connected: boolean | undefined
}

export type UseConnectionsProps = {
  userId?: string
}

export type GetConnectionsReturnType = Promise<BaseUserType[] | undefined>