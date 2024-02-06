import axiosInstance from "./refresh"


export async function get({ userId }) {
  try {
    let { data } = await axiosInstance.get(`/api/users/${userId}`)
    return data
  } catch (e) {
    console.error(e)
  }
}


export async function getMany({ userId }) {
  try {
    let { data } = await axiosInstance.get(`/api/users?` + new URLSearchParams({
      userId
    }))
    return data
  } catch (e) {
    console.error(e)
  }
}


export async function getConnections({ userId }) {
  try {
    let { data } = await axiosInstance.get(`/api/users/${userId}/connections`);
    console.log(data)
    return data;
  } catch (error) {
    console.error(e)
  }
}


export async function uploadPhoto({ formData, userId }) {
  try {
    let { data } = await axiosInstance.patch(`/api/users/${userId}/uploadPhoto/`,
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