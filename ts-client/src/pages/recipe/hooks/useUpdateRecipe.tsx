import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/services/axios";

// types
import { UseRecipeProps, UseUpdateRecipeProps } from "../models";

export const useUpdateRecipe = ({ recipeId }: UseRecipeProps) => {

  const queryClient = useQueryClient();

  if (!recipeId) throw new Error("id of recipe required")

  return useMutation({
    mutationFn: async ({ title, description }: UseUpdateRecipeProps) => {
      try {
        const { data: recipe } = await axiosInstance.patch(`/api/recipes/${recipeId}/`,
          {
            title,
            description
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        return recipe;
      } catch (e) {
        console.error(e)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] })
    }
  })
};