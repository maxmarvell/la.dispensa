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

export async function create({ data }) {
  console.log(data)
  try {
    const instructions = await axiosInstance.post(`/api/ingredients/`,
      data,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    )
    return instructions
  } catch (e) {
    console.error(e)
  }
}


export async function remove({ recipeId, ingredientId }) {
  try {
    const result = await axiosInstance.delete(`/api/ingredients/${recipeId}/${ingredientId}/`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    )
    return result;
  } catch (e) {
    console.error(e)
  }
}

export async function update({ recipeId, ingredientId, data }) {
  console.log(data)
  try {
    const result = await axiosInstance.patch(`/api/ingredients/${recipeId}/${ingredientId}/`,
      data,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    )
    return result;
  } catch (e) {
    console.error(e)
  }
}