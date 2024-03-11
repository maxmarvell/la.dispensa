import axiosInstance from "@/services/axios";
import { CreateIterationProps, DeleteIterationProps, GetIterationsReturnType, UpdateIterationProps, UseIterationProps } from "../models";

export const useIteration = () => {

  const getIterations = async ({ recipeId }: UseIterationProps): GetIterationsReturnType => {
    if (!recipeId) throw new Error("id of recipe required to get iterations!")
    try {
      const { data } = await axiosInstance.get('/api/iterations?' + new URLSearchParams({
        recipeId
      }));
      data.filter((el: any) => (el.parentId === null)).forEach((node: any) => node.parentId = "root");
      data.push({ id: "root", parentId: null })
      return data
    } catch (error) {
      console.error(error)
    };
  };

  const createIteration = async (input: CreateIterationProps) => {
    try {
      const { data } = await axiosInstance.post('/api/iterations/',
        {
          ...input
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateIteration = async ({ iterationId, input }: UpdateIterationProps) => {
    try {
      const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/`,
        {
          ...input
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return data;
    } catch (error) {
      console.error(error)
    }
  };

  const deleteIteration = async ({ iterationId }: DeleteIterationProps) => {
    try {
      const { data } = await axiosInstance.delete(`/api/iterations/${iterationId}/`,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return data;
    } catch (error) {
      console.error(error)
    }
  };

  return {
    getIterations,
    createIteration,
    updateIteration,
    deleteIteration
  }
}