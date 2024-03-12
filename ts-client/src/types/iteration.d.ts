import { BaseIngredientType } from "./ingredient";
import { BaseInstructionType } from "./instruction";
import { RequireAtLeastOne } from "./utility";

export interface BaseIterationType {
  id: string,
  tag: string,
};

export interface IterationIngredientType extends BaseIngredientType {
  iterationId: string
};

export interface IterationInstructionType extends BaseInstructionType {
  iterationId: string
};

export interface BaseCommentType {
  
}

export interface IterationCommentType {
  id: string
  text: string
  createdOn: Date
  iterationId: string
  userId: string
  user: UserType
};

export interface IterationType extends BaseIterationType {
  parentIngredients: BaseIngredientType<RequireAtLeastOne<{ recipeId?: string, iterationId?: string }, 'recipeId' | 'iterationId'>>[]
  parentInstructions: BaseInstructionType<RequireAtLeastOne<{ recipeId?: string, iterationId?: string }, 'recipeId' | 'iterationId'>>[]
  ingredients: IterationIngredientType[]
  instructions: IterationInstructionType[]
}