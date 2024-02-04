import axios from "axios";

let authToken = (
  localStorage.getItem('authToken')
) ? (
  JSON.parse(localStorage.getItem('authToken'))
) : (
  null
)

const axiosInstance = axios.create({
  baseURL: 'https://la-dispensa-api.onrender.com',
  headers: { Authorization: `Bearer ${authToken}` }
});


export default axiosInstance;