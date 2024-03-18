import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/auth";

export const ProtectedRoutes = () => {
	let { user } = useContext(AuthContext);
	return user ? <Outlet /> : <Navigate to="/login" />;
};