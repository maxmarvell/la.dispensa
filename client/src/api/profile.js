import axiosInstance from "./refresh";


export async function getRecipeGallery({ userId }) {
  try {
    const { data } = await axiosInstance.get(`/api/users/${userId}/gallery`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getRecipeCount({ userId }) {
  try {
    const { data } = await axiosInstance.get(`/api/users/${userId}/count-recipes`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getConnectionCount({ userId }) {
  try {
    const { data } = await axiosInstance.get(`/api/users/${userId}/count-connections`);
    return data;
  } catch (error) {
    console.error(error);
  };
};