import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { UseAcceptConnectionProps } from "../../../hooks/connections/models";


export const useAcceptConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId }: UseAcceptConnectionProps) => {
      if (!userId) throw new Error("UserId of request user missing!")
      try {
        let { data } = await axiosInstance.put(`/api/users/${userId}/connect/`);
        return data;
      } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connection-requests", "user-feed"] })
    }
  });
};