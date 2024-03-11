import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/services/axios";

// types
import { UseRecipeProps, UseUpdateTagsProps } from "../models";

export const useUpdateTags = ({ recipeId }: UseRecipeProps) => {

  const queryClient = useQueryClient();

  if (!recipeId) throw new Error("id of recipe required")

  return useMutation({
    mutationFn: async ({ tags }: UseUpdateTagsProps) => {

      if (!tags) throw new Error("title should not be undefined");

      try {
        const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/tags/`,
          {
            tags
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] })
    }
  })
};