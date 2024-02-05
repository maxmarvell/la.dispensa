import axios from "axios";

let authToken = (
  localStorage.getItem('authToken')
) ? (
  JSON.parse(localStorage.getItem('authToken'))
) : (
  null
)

const axiosInstance = axios.create({
  baseURL: import.meta.env.SERVER,
  headers: { Authorization: `Bearer ${authToken}` }
});


export default axiosInstance;