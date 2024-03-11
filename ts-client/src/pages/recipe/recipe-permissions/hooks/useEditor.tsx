import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { GetEditorsReturnType, UseEditorProps, MutateEditorProps } from "../models";


export const useEditor = ({ recipeId }: UseEditorProps) => {

  if (!recipeId) throw new Error("id of recipe is required but not found");

  const getEditors = useQuery({
    queryKey: ["editors", recipeId],
    queryFn: async (): GetEditorsReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/editors`);
        return data;
      } catch (error) {
        console.error(error);
      };
    }
  });

  const queryClient = useQueryClient();

  const addEditor = useMutation({
    mutationFn: async ({ userId }: MutateEditorProps) => {
      try {
        const { data } = await axiosInstance.post(`/api/recipes/${recipeId}/editors/`,
          {
            userId
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        return data;
      } catch (error) {
        console.error(error);
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editors', recipeId] })
    }
  });

  const removeEditor = useMutation({
    mutationFn: async ({ userId }: MutateEditorProps) => {
      try {
        const { data } = await axiosInstance.delete(`/api/recipes/${recipeId}/editors/${userId}/`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        return data;
      } catch (error) {
        console.error(error);
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editors', recipeId] })
    }
  })

  return {
    getEditors,
    addEditor,
    removeEditor
  }

}