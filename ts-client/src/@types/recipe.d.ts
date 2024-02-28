import { BaseComponent } from "./components";
import { UserType } from "./user";
import { InstructionType } from "./preparations";

export interface BaseRecipe {
  id: string,
  authorId: string,
  createdOn: Date,
  updatedAt: Date,
  title: string,
  description?: string,
  image?:string,
  public:boolean
};

export type TagType = {
  name: string,
  recipeId: string,
};

export type ReviewType = {
  recipeId: string,
  userId: string,
  text: string,
}

export type AggregatedReviewsType = {
  recipeId: string,
  _count: number,
}

export type AggregatedRatingsType = {
  recipeId: string,
  _count: number,
  _avg: {
    value: number
  }
}

export interface IngredientType {
  ingredient: {
    name: string,
    id: string
  },
  ingredientId: string,
  quantity: number | string,
  recipeId?: string,
  iterationId?: string,
  unit?: "G" | "KG" | "CUP" | "ML" | "L" | "OZ"
}

export interface RecipeGalleryType extends BaseRecipe {
  rating: AggregatedRatingsType,
  review: AggregatedReviewsType,
  editors: BaseUser[],
  author: BaseUser
}

export interface AdvancedRecipeType extends BaseRecipe {
  instructions: InstructionType[],
  ingredients: IngredientType[],
  editors: BaseUser[],
  author: BaseUser
}

export interface RecipeCompleteViewType extends AdvancedRecipeType {
  components: BaseComponent[]
  tags: TagType[]
}

export type RecipeSearchPropsType = {
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
}

export type RecipeTagSearchPropsType = {
  selectedTags: string[],
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}