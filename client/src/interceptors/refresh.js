import axios from "axios";

let authToken = (
  localStorage.getItem('authToken')
) ? (
  JSON.parse(localStorage.getItem('authToken'))
) : (
  null
)

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: { Authorization: `Bearer ${authToken}` }
});


export default axiosInstance;