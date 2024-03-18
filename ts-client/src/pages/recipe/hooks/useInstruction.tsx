import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/services/axios"
import { GetInstructionsReturnType, UseInstructionProps, CreateManyInstructionProps, UpdateInstructionProps, RemoveInstructionProps } from "../models";


export const useInstruction = ({ recipeId }: UseInstructionProps) => {

  if (!recipeId) throw new Error("id of recipe is required!")

  const getInstructions = useQuery({
    queryKey: ["instructions", recipeId],
    queryFn: async (): GetInstructionsReturnType => {
      try {
        const { data } = await axiosInstance.get("/api/instructions?" + new URLSearchParams({
          recipeId
        }));
        return data;
      } catch (error) {
        console.error(error);
      }
    }
  });

  const queryClient = useQueryClient();

  const createInstructions = useMutation({
    mutationFn: async ({ input }: CreateManyInstructionProps) => {
      try {
        const instructions = await axiosInstance.post(`/api/instructions/`,
        input.map(el => {
          el.recipeId = recipeId
          return el
        }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return instructions
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions', recipeId] })
    }
  });

  const updateInstruction = useMutation({
    mutationFn: async ({ input, step }: UpdateInstructionProps) => {
      try {
        const { data } = await axiosInstance.patch(`/api/instructions/${recipeId}/${step}`,
          input,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return data
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions', recipeId] })
    }
  });

  const removeInstruction = useMutation({
    mutationFn: async ({ step }: RemoveInstructionProps) => {
      try {
        const { data } = await axiosInstance.delete(`/api/instructions/${recipeId}/${step}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return data;
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions', recipeId] })
    }
  });

  return {
    getInstructions,
    createInstructions,
    updateInstruction,
    removeInstruction
  };
}