import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/services/axios";

// types
import { UseRecipeProps, UseUpdateRecipePictureInput } from "../models";

export const useUpdateRecipePicture = ({ recipeId }: UseRecipeProps) => {

  const queryClient = useQueryClient();

  if (!recipeId) throw new Error("id of recipe required")

  return useMutation({
    mutationFn: async ({ input }: UseUpdateRecipePictureInput) => {
      try {
        let { data } = await axiosInstance.patch(`/api/recipes/${recipeId}/uploadPhoto/`,
          input,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        return data;
      } catch (error) {
        console.error(error);
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] })
    }
  })
};