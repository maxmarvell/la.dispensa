import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { UseUserProps, UseUserReturnType } from "./models";

export const useUser = ({ userId }: UseUserProps) => {

  if (!userId) throw new Error("id of user required!")

  return useQuery({
    queryKey: ["user", userId],
    queryFn: async (): UseUserReturnType => {
      try {
        let { data } = await axiosInstance.get(`/api/users/${userId}`);
        return data;
      } catch (e) {
        console.error(e);
      };
    }
  })
};