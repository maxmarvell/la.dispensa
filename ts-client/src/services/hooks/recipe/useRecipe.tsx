import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { CreateRecipeProps, UseRecipeProps, UseRecipeReturnType } from "./models";

export const useRecipe = () => {

  const createRecipe = useMutation({
    mutationFn: async ({ title }: CreateRecipeProps) => {
      try {
        const { data } = await axiosInstance.post(
          '/api/recipes',
          {
            title
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        return data;
      } catch (e) {
        console.error(e);
      }
    }
  })

  const getRecipeById = ({ recipeId }: UseRecipeProps) => {
    if (!recipeId) throw new Error("id of recipe required")
    return useQuery({
      queryKey: ["recipe", recipeId],
      queryFn: async (): UseRecipeReturnType => {
        try {
          let { data } = await axiosInstance.get(`/api/recipes/${recipeId}`);
          return data;
        } catch (e) {
          console.error(e);
        };
      }
    });
  }


  const deleteRecipe = ({ recipeId }: UseRecipeProps) => {
    if (!recipeId) throw new Error("id of recipe required")
    return useMutation({
      mutationFn: async () => {
        try {
          const { data } = await axiosInstance.delete(`/api/recipes/${recipeId}/`,
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
          return data;
        } catch (error) {
          console.error(error)
        }
      }
    });
  }


  return {
    createRecipe,
    getRecipeById,
    deleteRecipe
  }
}