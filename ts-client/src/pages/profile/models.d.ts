import { AggregatedRatingsType, AggregatedReviewsType, BaseRecipeType } from "@/types/recipe";
import { BaseUserType, UserType } from "@/types/user";


export interface RecipeGalleryType extends BaseRecipeType {
  review: AggregatedReviewsType
  rating: AggregatedRatingsType
  editors: BaseUserType[]
  author: BaseUserType
}

export type UseRecipeGalleryProps = {
  userId?: string
}

export type GetRecipeGalleryReturnType = Promise<RecipeGalleryType[] | undefined>

// use aggregated connections
export type UseAggregatedConnectionsProps = {
  userId?: string
}
export type GetAggregatedConnectionsReturnType = Promise<number | undefined>

// use aggregated recipes
export type UseAggregatedRecipesProps = {
  userId?: string
}
export type GetAggregatedRecipesReturnType = Promise<number | undefined>

// profile picture
export type ProfilePictureProps = {
  user: BaseUserType
}
export type UseUpdateProfilePictureProps = {
  userId?: string
}
export type UseUpdateProfilePictureInput = {
  input: FormData
}

// connection status
export type ConnectionStatusProps = {
  user: UserType
}