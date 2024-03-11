import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import axiosInstance from "@/services/axios"
import { AddComponentProps, GetComponentsReturnType, QueryNewComponentsReturnType, RemoveComponentProps, UseComponentsProps, QueryNewComponentsProps } from "../models";


export const useComponents = ({ recipeId }: UseComponentsProps) => {

  if (!recipeId) throw new Error("id of recipe required for useComponents hook");

  const getComponents = useQuery({
    queryKey: ["components", recipeId],
    queryFn: async (): GetComponentsReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/components`)
        return data
      } catch (error) {
        console.error(error)
      }
    }
  })

  const take = 12;

  const queryNewComponents = ({ authorId, title, page }: QueryNewComponentsProps) => useQuery({
    queryKey: ['componentSearch', recipeId, authorId, title, page],
    queryFn: async (): QueryNewComponentsReturnType => {
      try {
        const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/availComponents?` + new URLSearchParams({
          title,
          authorId,
          page: page.toString(),
          take: take.toString(),
        }))
        return data;
      } catch (error) {
        console.error(error)
      }
    },
    placeholderData: keepPreviousData
  })

  const queryClient = useQueryClient();

  const addComponent = useMutation({
    mutationFn: async ({ componentId, amount }: AddComponentProps) => {
      try {
        return axiosInstance.post(`/api/recipes/${recipeId}/components/`,
          {
            componentId,
            amount
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['componentSearch, components'] })
    }
  })

  const removeComponent = useMutation({
    mutationFn: async ({ componentId }: RemoveComponentProps) => {
      try {
        return axiosInstance.delete(`/api/recipes/${recipeId}/components/${componentId}/`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['componentSearch, components'] })
    }
  })

  return {
    getComponents,
    queryNewComponents,
    addComponent,
    removeComponent
  }
}