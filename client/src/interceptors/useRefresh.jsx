import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/auth";


const useRefresh = () => {

  const { authToken, user, setUser, setAuthToken } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    headers: { Authorization: `Bearer ${authToken}` }
  });

  return axiosInstance
}

export default useRefresh;