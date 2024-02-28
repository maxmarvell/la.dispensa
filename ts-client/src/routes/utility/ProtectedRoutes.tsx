import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

// context
import AuthContext from "../../context/auth";

// types
import { AuthContextType } from "../../@types/context";

export const ProtectedRoutes = () => {
	const { user } = useContext(AuthContext) as AuthContextType;
	return user ? <Outlet /> : <Navigate to="/login" />;
};