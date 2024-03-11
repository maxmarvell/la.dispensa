import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { RecipeSearchProps, RecipeSearchReturnType, UseRecipeSearchProps } from "../models";

const take = 50;

export const useRecipeSearch = ({ userId }: UseRecipeSearchProps) => {
  return ({ title, page, tags }: RecipeSearchProps) => (
    useQuery({
      queryKey: ['recipes', title, page, tags],
      queryFn: async (): RecipeSearchReturnType => {
        try {
          let { data } = userId ? await axiosInstance.get(`/api/recipes?` + new URLSearchParams({
            title,
            page: page.toString(),
            take: take.toString(),
            tags: tags.join(','),
            userId
          })) : await axiosInstance.get(`/api/recipes?` + new URLSearchParams({
            title,
            page: page.toString(),
            take: take.toString(),
            tags: tags.join(','),
          }))
          return data;
        } catch (e) {
          console.error(e)
        }
      },
      placeholderData: keepPreviousData,
    })
  )
};