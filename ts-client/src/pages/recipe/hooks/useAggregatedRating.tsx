import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { UseRecipeProps, UseAggregatedRecipeReturnType } from "../models";

export const useAggregatedRating = ({ recipeId }: UseRecipeProps) => {

  if (!recipeId) throw new Error("id of user required!")

  return useQuery({
    queryKey: ["aggregate-rating", recipeId],
    queryFn: async (): UseAggregatedRecipeReturnType => {
      try {
        let { data } = await axiosInstance.get(`/api/recipes/${recipeId}/ratings`);
        return data;
      } catch (e) {
        console.error(e);
      };
    }
  })
};