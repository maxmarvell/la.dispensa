import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/services/axios";

// types
import { UseUpdateProfilePictureProps, UseUpdateProfilePictureInput } from "../models";

export const useUpdateProfilePicture = ({ userId }: UseUpdateProfilePictureProps) => {

  const queryClient = useQueryClient();

  if (!userId) throw new Error("id of user required")

  return useMutation({
    mutationFn: async ({ input }: UseUpdateProfilePictureInput) => {
      try {
        let { data } = await axiosInstance.patch(`/api/users/${userId}/uploadPhoto/`,
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
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    }
  })
};