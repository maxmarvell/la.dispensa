import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/auth";

const ProtectedRoutes = () => {
	let { user } = useContext(AuthContext);
	return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;