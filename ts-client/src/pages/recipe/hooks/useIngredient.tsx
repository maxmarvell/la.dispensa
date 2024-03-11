import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/services/axios"
import { CreateIngredientsProps, GetIngredientsReturnType, RemoveIngredientProps, UpdateIngredientProps, UseIngredientProps } from "../models"


export const useIngredient = ({ recipeId }: UseIngredientProps) => {

  if (!recipeId) throw new Error("id of recipe is required!")

  const getIngredients = useQuery({
    queryKey: ["ingredients", recipeId],
    queryFn: async (): GetIngredientsReturnType => {
      try {
        const { data } = await axiosInstance.get("/api/ingredients?" + new URLSearchParams({
          recipeId
        }))
        return data;
      } catch (e) {
        console.error(e);
      };
    }
  });

  const queryClient = useQueryClient();

  const createIngredients = useMutation({
    mutationFn: async ({ input }: CreateIngredientsProps) => {
      try {
        const { data } = await axiosInstance.post(`/api/ingredients/`,
          {
            input
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return data
      } catch (error) {
        console.error(error)
      }
    }
  });

  const removeIngredient = useMutation({
    mutationFn: async ({ ingredientId }: RemoveIngredientProps) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients', recipeId] });
    },
  });

  const updateIngredient = useMutation({
    mutationFn: async ({ ingredientId, input }: UpdateIngredientProps) => {
      try {
        const { data } = await axiosInstance.patch(`/api/ingredients/${recipeId}/${ingredientId}/`,
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients', recipeId] });
    },
  })

  return {
    getIngredients,
    removeIngredient,
    updateIngredient,
    createIngredients
  }

}