import axios from "axios";


let auth = JSON.parse(localStorage.getItem("authToken")!);
let authToken = auth !== "" ? auth : "";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  headers: { Authorization: `Bearer ${authToken}` }
});

axiosInstance.interceptors.request.use((config) => {

  if (localStorage.getItem("authToken") === null) return config;

  let auth = JSON.parse(localStorage.getItem("authToken")!);
  let authToken = auth !== "" ? auth : null;

  config.headers['Authorization'] = `Bearer ${authToken}`;
  return config;
});


export default axiosInstance;