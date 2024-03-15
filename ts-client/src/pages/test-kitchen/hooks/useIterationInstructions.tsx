import axiosInstance from "@/services/axios"
import { UseIterationInstructionProps, CreateManyIterationInstructionProps, UpdateIterationInstructionProps, RemoveIterationInstructionProps } from "../models";


export const useIterationInstruction = ({ iterationId }: UseIterationInstructionProps) => {

  if (!iterationId) throw new Error("id of iteration is required!")

  const createInstructions = async ({ input }: CreateManyIterationInstructionProps) => {
    try {
      const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/instructions/`,
        input,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return data
    } catch (error) {
      console.error(error)
    }
  };

  const updateInstruction = async ({ input, step }: UpdateIterationInstructionProps) => {
    try {
      const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/instructions/${step}/`,
        {
          ...input
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return data
    } catch (error) {
      console.error(error)
    }
  };

  const removeInstruction = async ({ step }: RemoveIterationInstructionProps) => {
    try {
      const { data } = await axiosInstance.delete(`/api/iterations/${iterationId}/instructions/${step}/`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return data;
    } catch (error) {
      console.error(error)
    }
  };

  return {
    createInstructions,
    updateInstruction,
    removeInstruction
  };
}