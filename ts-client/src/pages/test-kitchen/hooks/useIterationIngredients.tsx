import axiosInstance from "@/services/axios"
import { CreateManyIterationIngredientProps, RemoveIterationIngredientProps, UpdateIterationIngredientProps, UseIterationIngredientProps } from "../models"


export const useIterationIngredient = ({ iterationId }: UseIterationIngredientProps) => {

  if (!iterationId) throw new Error("id of recipe is required!")

  const createIngredients = async ({ input }: CreateManyIterationIngredientProps) => {
    try {
      const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/ingredients/`,
        input,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return data
    } catch (error) {
      console.error(error)
    }
  };

  const removeIngredient = async ({ ingredientId }: RemoveIterationIngredientProps) => {
    try {
      const { data } = await axiosInstance.delete(`/api/iterations/${iterationId}/ingredients/${ingredientId}/`,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      return data;
    } catch (e) {
      console.error(e)
    }
  };

  const updateIngredient = async ({ ingredientId, input }: UpdateIterationIngredientProps) => {
    try {
      const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/ingredients/${ingredientId}/`,
        {
          ...input
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      return data;
    } catch (e) {
      console.error(e)
    }
  };

  return {
    removeIngredient,
    updateIngredient,
    createIngredients
  };
};