import { BaseTagType } from "@/types/tag"
import { DetailedRecipeType } from "../recipe/models"

export type UseRecipeSearchProps = {
  userId?: string
}

export type RecipeSearchProps = {
  title: string
  page: number
  tags: sting[]
}

export type RecipeSearchReturnType = Promise<DetailedRecipeType[] | undefined>


export type TagSearchProps = {
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}

export type UseTagSearchProps = {
  name: string
  selectedTags: string[]
}

export type QueryTagsReturnType = Promise<BaseTagType[] | undefined>

export type RecipeCardProps = {
  recipe: DetailedRecipeType
}

export type RecipeSearchComponentProps = {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
}