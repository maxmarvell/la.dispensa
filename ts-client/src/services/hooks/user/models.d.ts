import { BaseUserType } from "@/types/user"

export type UseUserProps = {
  userId?: string
};

export type UseUserReturnType = Promise<BaseUserType | undefined>