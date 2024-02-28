import { TagType } from "../@types/recipe";
import axiosInstance from "./refresh";

type SearchTagsServiceType = {
  name: string
  excludeTags: string[]
}

export async function searchTags({ name, excludeTags }: SearchTagsServiceType) : Promise<TagType[] | undefined> {
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