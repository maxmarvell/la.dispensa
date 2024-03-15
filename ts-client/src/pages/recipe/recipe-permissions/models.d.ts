import { BaseUserType } from "@/types/user"

export type UserCardProps = {
  user: BaseUserType,
  selectedUser: BaseUserType | null,
  setSelectedUser: React.Dispatch<React.SetStateAction<selectedUser>>
}

export type UseEditorProps = {
  recipeId?: string
}

export type GetEditorsReturnType = Promise<{
  recipeId: string
  userId: string
  user: BaseUserType
}[] | undefined>

export type MutateEditorProps = {
  userId: string
}

export type UsePublishProps = {
  recipeId?: string
}

export type MutatePublishProps = {
  publish: boolean
}