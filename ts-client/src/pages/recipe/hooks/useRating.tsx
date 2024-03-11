import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/services/axios";
import { CreateRatingProps, GetRatingReturnType, UpdateRatingProps, UseRatingProps } from "../models";


export const useRating = ({ recipeId, userId }: UseRatingProps) => {


  const getRating = useQuery({
    queryKey: ['rating', userId, recipeId],
    queryFn: async (): GetRatingReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/ratings/${userId}`);
        return data;
      } catch (error) {
        console.error(error);
      };
    }
  });

  const queryClient = useQueryClient();

  const updateRating = useMutation({
    mutationFn: async ({ value }: UpdateRatingProps) => {
      const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/ratings/${userId}/`,
        {
          value
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', userId, recipeId] })
    }
  });

  const createRating = useMutation({
    mutationFn: async ({ value }: CreateRatingProps) => {
      const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/ratings/`,
        {
          value,
          userId
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', userId, recipeId] })
    }
  });

  return {
    getRating,
    updateRating,
    createRating
  }
}