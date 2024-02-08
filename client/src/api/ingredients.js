import axiosInstance from "./refresh"

export async function get({ recipeId }) {
  try {
    const { data } = await axiosInstance.get("/api/ingredients?" + new URLSearchParams({
      recipeId
    }))
    return data
  } catch (e) {
    console.error(e)
  }
}

export async function createIngredients({ data: input }) {
  try {
    const { data } = await axiosInstance.post(`/api/ingredients/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data
  } catch (e) {
    console.error(e)
  }
}


export async function remove({ recipeId, ingredientId }) {
  try {
    const { data } = await axiosInstance.delete(`/api/ingredients/${recipeId}/${ingredientId}/`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    )
    return data;
  } catch (e) {
    console.error(e)
  }
}

export async function update({ recipeId, ingredientId, data: input }) {
  try {
    const { data } = await axiosInstance.patch(`/api/ingredients/${recipeId}/${ingredientId}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    )
    return data;
  } catch (e) {
    console.error(e)
  }
}