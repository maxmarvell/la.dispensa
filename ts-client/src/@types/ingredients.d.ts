import { BaseComponent } from "./components";
import { IngredientType } from "./recipe";

export interface BaseIngredient {
  ingredient: {
    name: string,
    id: string
  },
  quantity: number | string,
  unit?: "G" | "KG" | "CUP" | "ML" | "L" | "OZ",
};

export interface IngredientType extends BaseIngredient {
  recipeId?: string,
  iterationId?: string,
  ingredientId: string
}

export interface NewIngredientType extends BaseIngredient {
  ingredient: {
    name: string,
  },
  index: number,
  quantity: number | string,
  recipeId: string | undefined,
}

export type createIngredientPropsType = {
  newIngredient: BaseIngredient<{index: number}>,
  setNewIngredient: (value: React.SetStateAction<BaseIngredient<{index: number}>[]>) => void
};

export type RecipeIngredientsType = {
  ingredients: IngredientType[],
  components: BaseComponent[],
};