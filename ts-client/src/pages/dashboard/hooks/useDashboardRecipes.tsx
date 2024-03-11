import axiosInstance from "@/services/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

// types
import { RecipeInfiniteScrollType, UseDashboardRecipesProps } from "../models";

function getDashboardRecipes({ take, lastCursor }: any): Promise<RecipeInfiniteScrollType> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get('/api/dashboard/recipes', {
          params: { take, lastCursor }
        });
        resolve(data)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    }, 1000)
  });
};

export const useDashboardRecipes = ({ take }: UseDashboardRecipesProps) => (
  useInfiniteQuery(
    {
      queryKey: ["dashboardRecipes"],
      initialPageParam: "",
      queryFn: ({ pageParam = "" }) => getDashboardRecipes({ take, lastCursor: pageParam }),
      getNextPageParam: (lastPage) => {
        return lastPage?.lastCursor;
      }
    }
  )
);