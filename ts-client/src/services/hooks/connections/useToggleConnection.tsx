import { useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";

// types
import { UseToggleConnectionInput, UseToggleConnectionProps } from "./models";

export const useToggleConnection = ({ userId }: UseToggleConnectionProps) => {

  if (!userId) throw new Error("No Id of user!");

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accepted, connected, connectedWith }: UseToggleConnectionInput) => {
      if (connected) {
        if (accepted || connectedWith) {
          return axiosInstance.delete(`/api/users/${userId}/connect/`);
        } else {
          return axiosInstance.put(`/api/users/${userId}/connect/`);
        }
      } else {
        return axiosInstance.post(`/api/users/${userId}/connect/`);
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-feed", userId] });
    }
  });
};