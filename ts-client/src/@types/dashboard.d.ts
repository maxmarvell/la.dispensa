import { BaseRecipe } from "./recipe";
import { AggregatedRatingsType, AggregatedReviewsType, TagType } from "./recipe";
import { BaseUser, UserType } from "./user";
import { FetchNextPageOptions, InfiniteQueryObserverResult, InfiniteData } from "@tanstack/react-query";

export interface DashboardRecipesType extends BaseRecipe {
  tags: TagType[],
  author: UserType,
  review: AggregatedReviewsType,
  rating: AggregatedRatingsType
}

export type RecipeInfiniteScrollType = {
  recipes: DashboardRecipesType[],
  hasNextPage: boolean,
  lastCursor: string,
}

export type RecipeCardType = {
  recipe: DashboardRecipesType,
  last: Boolean,
  hasNextPage: Boolean,
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<RecipeInfiniteScrollType, unknown>, Error>>
}

export interface RecipeNotificationType extends BaseRecipe {
  author: BaseUser,
}

export type OnScreenProps = {
  infiniteScrollRef: React.RefObject<HTMLDivElement>
}