import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query"
import axiosInstance from "@/services/axios";

// types
import { CreateCommentProps, GetIterationCommentsReturnType, UseCommentProps } from "../models";

export const useComment = ({ iterationId }: UseCommentProps) => {

  const getComments = useQuery({
    queryKey: ["comments", iterationId],
    queryFn: async (): GetIterationCommentsReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/iterations/${iterationId}/comments`);
        return data;
      } catch (error) {
        console.error(error)
      }
    },
    placeholderData: keepPreviousData
  });

  const createComment = useMutation({
    mutationFn: async ({ text }: CreateCommentProps) => {
      try {
        const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/comments/`,
          {
            text
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        return data;
      } catch (error) {
        console.error(error);
      };
    }
  })

  return {
    getComments,
    createComment
  }
}