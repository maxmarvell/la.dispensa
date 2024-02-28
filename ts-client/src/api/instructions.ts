import axiosInstance from "./refresh";
import { RecipePreparations } from "../@types/preparations";


export async function getInstructions({ recipeId }: any): Promise<RecipePreparations | undefined> {
  try {
    const { data } = await axiosInstance.get("/api/instructions?" + new URLSearchParams({
      recipeId
    }))
    return data
  } catch (e) {
    console.error(e)
  }
}



export async function createInstructions({ data }: any) {
  try {
    const instructions = await axiosInstance.post(`/api/instructions/`,
      data,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
    return instructions
  } catch (e) {
    console.error(e)
  }
}


export async function updateInstruction({ recipeId, step, data }: any) {
  try {
    const instructions = await axiosInstance.patch(`/api/instructions/${recipeId}/${step}`,
      data,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
    return instructions;
  } catch (e) {
    console.error(e);
  }
}


export async function removeInstruction({ recipeId, step }: any) {
  try {
    return axiosInstance.delete(`/api/instructions/${recipeId}/${step}`,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
  } catch (e) {
    console.error(e);
  }
}