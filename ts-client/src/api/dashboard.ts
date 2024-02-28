import { RecipeInfiniteScrollType, RecipeNotificationType } from "../@types/dashboard";
import { UserType } from "../@types/user";
import axiosInstance from "./refresh";

export async function getDashboardRecipes({ take, lastCursor }: any): Promise<RecipeInfiniteScrollType> {
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


export async function getUserFeed({ take, username }: any) {
  try {
    const { data } = await axiosInstance.get('/api/dashboard/users', {
      params: { take, username }
    });
    return data as UserType[];
  } catch (error) {
    console.error(error);
  }
};


export async function getRecipeNotifications(): Promise<RecipeNotificationType[]> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get('/api/dashboard/recipe-notifications');
        resolve(data)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    }, 500)
  });
}
