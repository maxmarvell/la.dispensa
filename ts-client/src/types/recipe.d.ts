import { BaseIngredientType } from "./ingredient"
import { BaseInstructionType } from "./instruction"

export interface BaseRecipeType {
  id: string
  authorId: string
  title: string
  image?: string
  createdOn: Date
  updatedAt: Date
  description?: string
  public: boolean
}

export interface BaseRecipeIngredientType extends BaseIngredientType {
  recipeId: string
}

export interface BaseRecipeInstructionType extends BaseInstructionType {
  recipeId: string
}

export interface BaseEditorType {
  recipeId: string
  userId: string
}

export interface BaseReview {
  recipeId: string
  userId: string
  text: string
  createdOn: Date
}

export interface BaseRating {
  recipeId: string
  userId: string
  value: number
}

export type AggregatedReviewsType = {
  recipeId: string
  _count: number
}

export type AggregatedRatingsType = {
  recipeId: string
  _count: number
  _avg: {
    value: number
  }
}
