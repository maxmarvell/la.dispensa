import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import AuthContext from "../../context/auth";
import { useQuery } from "@tanstack/react-query";
import { getEditors, getRecipe } from "../../api/recipe";
import { SocketProvider } from "../../context/socket";

export const ProtectTestKitchenRoutes = () => {

  const { recipeId } = useParams();

  const { user } = useContext(AuthContext);

  const { data: recipe, isLoading: recipeLoading } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipe({ recipeId })
  })

  const { data, isLoading } = useQuery({
    queryKey: ["editors", user],
    queryFn: () => getEditors({ recipeId })
  });

  if (isLoading) {
    return (
      <div></div>
    );
  };

  if (recipeLoading) {
    return (
      <div></div>
    );
  };

  const hasAccess = data?.map(el => el.id).includes(user?.id) || recipe?.authorId === user?.id;
  return true ? (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  ) : <Navigate to="/login" />;
};