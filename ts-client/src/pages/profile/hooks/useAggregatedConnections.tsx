import axiosInstance from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

// types
import { UseAggregatedConnectionsProps, GetAggregatedConnectionsReturnType } from "../models";

export const useAggregatedConnections = ({ userId }: UseAggregatedConnectionsProps) => {

  if (!userId) throw new Error("id of user required!");

  return useQuery({
    queryKey: ["aggregate-connections", userId],
    queryFn: async (): GetAggregatedConnectionsReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/users/${userId}/count-connections`);
        return data;
      } catch (error) {
        console.error(error);
      };
    }
  });
};