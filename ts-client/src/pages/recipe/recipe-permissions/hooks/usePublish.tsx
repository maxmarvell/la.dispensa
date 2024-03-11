import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/services/axios"
import { MutatePublishProps, UsePublishProps } from "../models";

export const usePublish = ({ recipeId }: UsePublishProps) => {
  if (!recipeId) throw new Error("id of recipe required to published");

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ publish }: MutatePublishProps) => {
      try {
        const { data: recipe } = await axiosInstance.patch(`/api/recipes/${recipeId}/`,
          {
            public: publish
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        return recipe;
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] })
    }
  })
}