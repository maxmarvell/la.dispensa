import axiosInstance from "./refresh";

export async function searchTags({ name, excludeTags }) {
  try {
    const { data } = await axiosInstance.get(`/api/tags?` + new URLSearchParams({
      name,
      excludeTags: excludeTags.join(',')
    }));
    return data;
  } catch(error) {
    console.error(error);
  }

}