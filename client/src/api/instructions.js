import axiosInstance from "../interceptors/refresh"


export async function get({ recipeId }) {
  try {
    const { data } = await axiosInstance.get("/api/instructions?" + new URLSearchParams({
      recipeId
    }))
    return data
  } catch (e) {
    console.error(e)
  }
}



export async function post({ data }) {
  try {
    const instructions = await axiosInstance.post(`/api/instructions/`,
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


export async function update({ recipeId, step, data }) {
  try {
    const instructions = await axiosInstance.patch(`/api/instructions/${recipeId}/${step}`,
      data,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return instructions;
  } catch (e) {
    console.error(e);
  }
}


export async function remove({ recipeId, step }) {
  try {
    return axiosInstance.delete(`/api/instructions/${recipeId}/${step}`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
  } catch (e) {
    console.error(e);
  }
}