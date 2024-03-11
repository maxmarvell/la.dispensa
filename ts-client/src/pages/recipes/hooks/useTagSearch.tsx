import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";

// services
import { QueryTagsReturnType, UseTagSearchProps } from "../models";

export const useTagSearch = ({ name, selectedTags }: UseTagSearchProps) => useQuery({
  queryKey: ["tags", name, selectedTags],
  queryFn: async (): QueryTagsReturnType => {
    try {
      const { data } = await axiosInstance.get(`/api/tags?` + new URLSearchParams({
        name,
        excludeTags: selectedTags.join(',')
      }));
      return data;
    } catch(error) {
      console.error(error);
    }
  }
})