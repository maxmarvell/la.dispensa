import axiosInstance from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

// types
import { UseAggregatedRecipesProps, GetAggregatedRecipesReturnType } from "../models";

export const useAggregatedRecipes = ({ userId }: UseAggregatedRecipesProps) => {

  if (!userId) throw new Error("id of user required!");

  return useQuery({
    queryKey: ["aggregate-connections", userId],
    queryFn: async (): GetAggregatedRecipesReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/users/${userId}/count-recipes`);
        return data;
      } catch (error) {
        console.error(error);
      };
    }
  });
};