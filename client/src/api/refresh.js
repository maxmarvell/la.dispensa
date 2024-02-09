import axios from "axios";

let authToken = (
  localStorage.getItem('authToken')
) ? (
  JSON.parse(localStorage.getItem('authToken'))
) : (
  null
)

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  headers: { Authorization: `Bearer ${authToken}` }
});

axiosInstance.interceptors.request.use((config) => {

  let authToken = (
    localStorage.getItem('authToken')
  ) ? (
    JSON.parse(localStorage.getItem('authToken'))
  ) : (
    null
  );
  
  config.headers['Authorization'] = `Bearer ${authToken}`;
  return config;
});


export default axiosInstance;