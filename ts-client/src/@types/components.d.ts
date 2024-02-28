import { AdvancedRecipeType } from "./recipe";


export interface BaseComponent {
  component: AdvancedRecipeType,
  amount: number,
  recipeId: string,
  componentId: string,
}