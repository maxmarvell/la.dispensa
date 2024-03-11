import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";

// types
import { GetRecipeGalleryReturnType, UseRecipeGalleryProps } from "../models";

export const useRecipeGallery = ({ userId }: UseRecipeGalleryProps) => {

  if (!userId) throw new Error("id of user required!");

  return useQuery({
    queryKey: ['gallery', userId],
    queryFn: async (): GetRecipeGalleryReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/users/${userId}/gallery`);
        return data;
      } catch (error) {
        console.error(error);
      };
    }
  });
};