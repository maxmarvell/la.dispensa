import { InfiniteQueryObserverResult, InfiniteData, FetchNextPageOptions } from "@tanstack/react-query";

type Recipe = {
  id: string
  title: string
  image?: string
  authorId: string
  description?: string
  createdOn: string
  updatedAt: string
}

interface BaseUser {
  id: string,
  username: string,
  image?: string,
}

type Connection = {
  connectedWithId: string
  connectedById: string
  accepted: boolean
  connectedWith: BaseUser
  connectedBy: BaseUser
}

export interface User extends BaseUser {
  connectedWith: Connection[]
  connectedBy: Connection[]
}

type Tag = {
  name: string,
  recipeId: string,
};


type AggregatedReviews = {
  recipeId: string,
  _count: number,
}

type AggregatedRatings = {
  recipeId: string,
  _count: number,
  _avg: {
    value: number
  }
}

export interface UseDashboardRecipesProps {
  take: number
}

export interface DashboardRecipesType extends Recipe {
  tags: Tag[],
  author: User,
  review: AggregatedReviews,
  rating: AggregatedRatings
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

export interface RecipeNotificationType extends Recipe {
  author: User,
}

// hook props
export type UseOnScreenProps = {
  infiniteScrollRef: React.RefObject<HTMLDivElement>
}

export type UseUserSearchProps = {
  username: string,
  take: number,
}

export type GetUserFeedReturnType = Promise<User[] | undefined>;

export type UserCardProps = {
  user: User
};

// connection requests
export type GetConnectionRequestsReturnType = Promise<Connection[] | undefined>