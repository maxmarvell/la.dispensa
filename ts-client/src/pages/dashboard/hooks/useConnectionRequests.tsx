import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { GetConnectionRequestsReturnType } from "../models";

export const useConnectionRequests = () => useQuery({
  queryKey: ["connection-requests"],
  queryFn: async (): GetConnectionRequestsReturnType => {
    try {
      let { data } = await axiosInstance.get(`/api/users/connection-requests`);
      return data;
    } catch (error) {
      console.error(error);
    };
  }
});