import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";

// types
import { SearchTestKitchenReturnType, UseSearchTestKitchenProps } from "../models";

export const useSearchTestKitchen = ({ userId, title }: UseSearchTestKitchenProps) => {
  if (!userId) throw new Error("id of current user is required")
  return useQuery({
    queryKey: ['testKitchen', userId, title],
    queryFn: async () : SearchTestKitchenReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/recipes/test-kitchen?` + new URLSearchParams({
          title
        }));
        return data;
      } catch (error) {
        console.error(error);
      };
    },
    placeholderData: keepPreviousData,
  });
};