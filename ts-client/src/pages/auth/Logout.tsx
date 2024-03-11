import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

import AuthContext from "@/services/contexts/authContext";
import { AuthContextType } from "@/services/contexts/models";

export const Logout = () => {

  const { logoutUser } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    logoutUser()
  }, []);
  return <Navigate to="/login" />
};

export default Logout;