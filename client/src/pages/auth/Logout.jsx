import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/auth";

export default function Logout() {

  const { logoutUser } = useContext(AuthContext)

  useEffect(() => {
    logoutUser()
  }, []);
  return <Navigate to="/login" />
}