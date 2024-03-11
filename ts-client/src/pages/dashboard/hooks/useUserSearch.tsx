import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";

// types
import { UseUserSearchProps, GetUserFeedReturnType } from "../models";

async function getUserFeed({ username, take }: UseUserSearchProps): GetUserFeedReturnType {
  try {
    const { data } = await axiosInstance.get('/api/dashboard/users', {
      params: { take, username }
    });
    return data;
  } catch (error) {
    console.error(error);
  };
};


export const useUserSearch = ({ username, take }: UseUserSearchProps) => (
  useQuery({
    queryKey: ["user-feed", username],
    queryFn: () => getUserFeed({ username, take }),
  })
);