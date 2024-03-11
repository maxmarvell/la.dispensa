import axios from "axios";

// attempt retrieve token
let auth = JSON.parse(localStorage.getItem("authToken")!);
let authToken = auth !== "" ? auth : "";

// create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  headers: { Authorization: `Bearer ${authToken}` }
});

// request interceptor
axiosInstance.interceptors.request.use((config) => {

  if (localStorage.getItem("authToken") === null) return config;

  let auth = JSON.parse(localStorage.getItem("authToken")!);
  let authToken = auth !== "" ? auth : null;


  config.headers['Authorization'] = `Bearer ${authToken}`;
  return config;
});

export default axiosInstance;