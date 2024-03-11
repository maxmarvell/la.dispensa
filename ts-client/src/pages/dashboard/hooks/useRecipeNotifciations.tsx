import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { RecipeNotificationType } from "../models";

export const useRecipeNotifications = () => (
  useQuery({
    queryKey: ["recipe-notifications"],
    queryFn: async (): Promise<RecipeNotificationType[]> => {
      try {
        const { data } = await axiosInstance.get('/api/dashboard/recipe-notifications');
        return data
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  })
);