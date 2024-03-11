import { AdvancedRecipeType } from "@/pages/recipe/models"

export type UseRecipeProps = {
  recipeId?: string
}

export type CreateRecipeProps = {
  title: string
}

export type UseRecipeReturnType = Promise<AdvancedRecipeType | undefined>