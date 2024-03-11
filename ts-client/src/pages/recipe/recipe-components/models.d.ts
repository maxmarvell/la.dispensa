import { ComponentType, DetailedRecipeType } from "../models"

export type ActiveComponentCardProps = {
  data: ComponentType
}

export type ActiveRecipeType = DetailedRecipeType | null

export type RecipeCardProps = {
  recipe:DetailedRecipeType
  setActive: React.Dispatch<React.SetStateAction<ActiveRecipeType>>
}

export type UseComponentsProps = {
  recipeId?: string
}

export type GetComponentsReturnType = Promise<ComponentType[] | undefined>

export type QueryNewComponentsProps = {
  authorId: string
  title: string
  page: number
}

export type QueryNewComponentsReturnType = Promise<DetailedRecipeType[] | undefined>


export type RemoveComponentProps = {
  componentId: string
}

export type AddComponentProps = {
  componentId: string,
  amount: number
}