import axios from "axios";

let authToken = (
  localStorage.getItem('authToken')
) ? (
  JSON.parse(localStorage.getItem('authToken'))
) : (
  null
)

// const SERVER="https://la-dispensa-api.onrender.com"
const SERVER="http://localhost:3000"

const axiosInstance = axios.create({
  baseURL: SERVER,
  headers: { Authorization: `Bearer ${authToken}` }
});


export default axiosInstance;