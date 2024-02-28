import { RecipeIngredientsType } from "../@types/ingredients";
import axiosInstance from "./refresh"

export async function getIngredients({ recipeId }: any): Promise<RecipeIngredientsType | undefined> {
  try {
    const { data } = await axiosInstance.get("/api/ingredients?" + new URLSearchParams({
      recipeId
    }))
    return data;
  } catch (e) {
    console.error(e);
  };
};

export async function createIngredients({ data: input }: any) {
  try {
    const { data } = await axiosInstance.post(`/api/ingredients/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return data
  } catch (e) {
    console.error(e)
  }
}


export async function removeIngredient({ recipeId, ingredientId }: any) {
  try {
    const { data } = await axiosInstance.delete(`/api/ingredients/${recipeId}/${ingredientId}/`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
    return data;
  } catch (e) {
    console.error(e)
  }
}

export async function updateIngredient({ recipeId, ingredientId, data: input }: any) {
  try {
    const { data } = await axiosInstance.patch(`/api/ingredients/${recipeId}/${ingredientId}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
    return data;
  } catch (e) {
    console.error(e)
  }
}