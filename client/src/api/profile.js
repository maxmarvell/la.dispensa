import axiosInstance from "../interceptors/refresh";


export async function getRecipeGallery({ userId }) {
  try {
    const { data } = await axiosInstance.get(`/api/users/${userId}/gallery`);
    return data;
  } catch (error) {
    console.error(error);
  };
};


export async function getConnectedBy({ userId }) {
  try {
    const { data } = await axiosInstance.get(`/api/users/${userId}/connected-by`);
    return data;
  } catch (error) {
    console.error(error);
  };
};