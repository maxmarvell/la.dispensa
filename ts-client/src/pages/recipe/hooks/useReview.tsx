import axiosInstance from "@/services/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateReviewProps, GetManyReviewsReturnType, GetReviewReturnType, UpdateReviewProps, UseReviewProps } from "../models"

export const useReview = ({ recipeId, userId }: UseReviewProps) => {

  if (!recipeId) throw new Error("id of recipe is required!")
  
  const getManyReviews = useQuery({
    queryKey: ["reviews", recipeId],
    queryFn: async (): GetManyReviewsReturnType => {
      try {
        let { data } = await axiosInstance.get(`/api/recipes/${recipeId}/reviews/`);
        return data;
      } catch (error) {
        console.error(error);
      }
    }
  });

  
  const getReview = useQuery({
    queryKey: ["review", recipeId, userId],
    queryFn: async (): GetReviewReturnType => {
      try {
        let { data } = await axiosInstance.get(`/api/recipes/${recipeId}/reviews/${userId}`);
        return data;
      } catch (e) {
        console.error(e);
      };
    }
  });
  
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: async ({ text }: CreateReviewProps) => {
      try {
        const { data: recipe } = await axiosInstance.post(`/api/recipes/${recipeId}/reviews/`,
          {
            text,
            userId
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
      queryClient.invalidateQueries({ queryKey: ['review', recipeId] })
    }
  });

  const updateReview = useMutation({
    mutationFn: async ({ text }: UpdateReviewProps) => {
      try {
        const { data: recipe } = await axiosInstance.put(`/api/recipes/${recipeId}/reviews/${userId}/`,
          {
            text
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
      queryClient.invalidateQueries({ queryKey: ['review', recipeId] })
    }
  });

  return {
    getReview,
    getManyReviews,
    createReview,
    updateReview
  }
};