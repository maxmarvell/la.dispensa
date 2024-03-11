import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "@/services/contexts/authContext";
import { AuthContextType } from "@/services/contexts/models";

export const ProtectedRoutes = () => {
	const { user } = useContext(AuthContext) as AuthContextType;
	return user ? <Outlet /> : <Navigate to="/login" />;
};