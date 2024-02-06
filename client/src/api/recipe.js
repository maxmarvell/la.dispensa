import axiosInstance from "./refresh"

export async function getRecipe({ recipeId }) {
  try {
    let { data } = await axiosInstance.get(`/api/recipes/${recipeId}`)
    return data
  } catch (e) {
    console.error(e)
  }
}


export async function getRecipes({ title, page, take, tags }) {
  try {
    let { data } = await axiosInstance.get(`/api/recipes?` + new URLSearchParams({
      title,
      page,
      take,
      tags: tags.join(',')
    }), { timeout: 5000 })
    return data
  } catch (e) {
    console.error(e)
  }
}


export async function createRecipe({ title }) {
  try {
    const { data } = await axiosInstance.post(
      '/api/recipes',
      {
        title
      },
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (e) {
    console.error(e);
  }
}


export async function editRecipe({ recipeId, data }) {
  try {
    const { data: recipe } = await axiosInstance.patch(`/api/recipes/${recipeId}/`,
      {
        ...data
      },
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return recipe;
  } catch (e) {
    console.error(e)
  }
}

export async function uploadPhoto({ formData, recipeId }) {
  try {
    let { data } = await axiosInstance.patch(`/api/recipes/${recipeId}/uploadPhoto/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      },
      { withCredentials: true });
    return data;
  } catch (error) {
    console.error(error);
  };
}


export async function getComponents({ recipeId }) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/components`)
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function connectComponent({ recipeId, data }) {
  console.log(data)
  try {
    return axiosInstance.post(`/api/recipes/${recipeId}/components/`,
      data,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    )
  } catch (error) {

  }
}


export async function removeComponentConnection({ recipeId, componentId }) {
  try {
    return axiosInstance.delete(`/api/recipes/${recipeId}/components/${componentId}/`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    )
  } catch (error) {
    console.error(error)
  }
}


export async function getAvailableComponents({ title, recipeId, authorId, page, take }) {

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


export async function deleteRecipe({ recipeId }) {
  try {
    const { data } = await axiosInstance.delete(`/api/recipes/${recipeId}/`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error)
  }
}


export async function getEditors({ recipeId }) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/editors`);
    return data;
  } catch (error) {
    console.error(error);
  };
};


export async function addEditor({ recipeId, userId }) {
  try {
    const { data } = await axiosInstance.post(`/api/recipes/${recipeId}/editors/`,
      {
        userId
      },
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


export async function removeEditor({ recipeId, userId }) {
  try {
    const { data } = await axiosInstance.delete(`/api/recipes/${recipeId}/editors/${userId}/`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Reviews

export async function getReviews({ recipeId }) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/reviews`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getReview({ recipeId, userId }) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/reviews/${userId}`)
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function createReview({ recipeId, input }) {
  try {
    const { data } = await axiosInstance.post(`/api/recipes/${recipeId}/reviews/`,
      {
        ...input
      },
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function updateReview({ recipeId, userId, input }) {
  try {
    const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/reviews/${userId}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error)
  }
}

// Ratings

export async function createRating({ recipeId, input }) {
  try {
    const { data } = await axiosInstance.post(`/api/recipes/${recipeId}/ratings/`,
      {
        ...input
      },
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Rating

export async function getRating({ recipeId, userId }) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/ratings/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function updateRating({ recipeId, userId, input }) {
  try {
    const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/ratings/${userId}/`,
      {
        ...input
      },
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getAggregatedRating({ recipeId }) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}/ratings`);
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Tags

export async function updateTags({ recipeId, input }) {
  try {
    const { data } = await axiosInstance.put(`/api/recipes/${recipeId}/tags/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};