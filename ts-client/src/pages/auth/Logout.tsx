import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/auth";
import { AuthContextType } from "../../@types/context";

export default function Logout() {

  const { logoutUser } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    logoutUser()
  }, []);
  return <Navigate to="/login" />
}