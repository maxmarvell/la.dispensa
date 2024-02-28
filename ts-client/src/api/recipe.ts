import { BaseComponent } from "../@types/components";
import { DashboardRecipesType } from "../@types/dashboard";
import { RecipeCompleteViewType } from "../@types/recipe";
import { UserType, BaseUser } from "../@types/user";
import axiosInstance from "./refresh"

export async function getRecipe({ recipeId }: any): Promise<RecipeCompleteViewType | undefined> {
  try {
    let { data } = await axiosInstance.get(`/api/recipes/${recipeId}`)
    return data
  } catch (e) {
    console.error(e)
  }
}


export async function getRecipes({ title, page, take, tags, userId }: any): Promise<DashboardRecipesType[] | undefined> {
  try {
    let { data } = await axiosInstance.get(`/api/recipes?` + new URLSearchParams({
      title,
      page,
      take,
      tags: tags.join(','),
      userId: userId,
    }));
    return data;
  } catch (e) {
    console.error(e)
  }
}


export async function createRecipe({ title }: any) {
  try {
    const { data } = await axiosInstance.post(
      '/api/recipes',
      {
        title
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    );
    return data;
  } catch (e) {
    console.error(e);
  }
}


export async function editRecipe({ recipeId, data }: any) {
  try {
    const { data: recipe } = await axiosInstance.patch(`/api/recipes/${recipeId}/`,
      data,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    );
    return recipe;
  } catch (e) {
    console.error(e)
  }
}

export async function uploadPhoto({ formData, recipeId }: any) {
  try {
    let { data } = await axiosInstance.patch(`/api/recipes/${recipeId}/uploadPhoto/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
}


export async function getComponents({ recipeId }: any): Promise<BaseComponent[] | undefined> {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/components`)
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function connectComponent({ recipeId, data }: any) {
  try {
    return axiosInstance.post(`/api/recipes/${recipeId}/components/`,
      data,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    )
  } catch (error) {

  }
}


export async function removeComponentConnection({ recipeId, componentId }: any) {
  try {
    return axiosInstance.delete(`/api/recipes/${recipeId}/components/${componentId}/`,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    )
  } catch (error) {
    console.error(error)
  }
}


export async function getAvailableComponents({ title, recipeId, authorId, page, take }: any): Promise<DashboardRecipesType[] | undefined> {

  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/availComponents?` + new URLSearchParams({
      title,
      authorId,
      page,
      take
    }))
    return data;
  } catch (error) {
    console.error(error)
  }
}


export async function deleteRecipe({ recipeId }: any) {
  try {
    const { data } = await axiosInstance.delete(`/api/recipes/${recipeId}/`,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
    return data;
  } catch (error) {
    console.error(error)
  }
}


export async function getEditors({ recipeId }: any): Promise<BaseUser[] | undefined> {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/editors`);
    return data as UserType[];
  } catch (error) {
    console.error(error);
  };
};


export async function addEditor({ recipeId, userId }: any) {
  try {
    const { data } = await axiosInstance.post(`/api/recipes/${recipeId}/editors/`,
      {
        userId
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


export async function removeEditor({ recipeId, userId }: any) {
  try {
    const { data } = await axiosInstance.delete(`/api/recipes/${recipeId}/editors/${userId}/`,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Reviews

export async function getReviews({ recipeId }: any) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/reviews`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getReview({ recipeId, userId }: any) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/reviews/${userId}`)
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function createReview({ recipeId, input }: any) {
  try {
    const { data } = await axiosInstance.post(`/api/recipes/${recipeId}/reviews/`,
      {
        ...input
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function updateReview({ recipeId, userId, input }: any) {
  try {
    const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/reviews/${userId}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
    return data;
  } catch (error) {
    console.error(error)
  }
}

// Ratings

export async function createRating({ recipeId, input }: any) {
  try {
    const { data } = await axiosInstance.post(`/api/recipes/${recipeId}/ratings/`,
      {
        ...input
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Rating

export async function getRating({ recipeId, userId }: any) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/ratings/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function updateRating({ recipeId, userId, input }: any) {
  try {
    const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/ratings/${userId}/`,
      {
        ...input
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getAggregatedRating({ recipeId }: any) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/ratings`);
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Tags

export async function updateTags({ recipeId, input }: any) {
  try {
    const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/tags/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};