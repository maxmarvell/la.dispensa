import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { GetConnectionsReturnType, UseConnectionsProps } from "./models";



export const useConnections = ({ userId }: UseConnectionsProps) => {

  if (!userId) throw new Error("id of user requuired for useConnections hook");

  const getConnections = useQuery({
    queryKey: ["connections", userId],
    queryFn: async (): GetConnectionsReturnType  => {
      try {
        let { data } = await axiosInstance.get("/api/users/connections");
        return data;
      } catch (error) {
        console.error(error);
      };
    }
  });

  return {
    getConnections
  }
}