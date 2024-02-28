import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEditors, getRecipe } from "../../api/recipe";
import { SocketProvider } from "../../context/socket";
import AuthContext from "../../context/auth";
import { AuthContextType } from "../../@types/context";

export const ProtectTestKitchenRoutes = () => {

  const { recipeId } = useParams();

  const { user } = useContext(AuthContext) as AuthContextType;

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

  // check if the current user is an editor of the author of the recipe
  const hasAccess = data?.map(el => el.id).includes(user?.id || "") || recipe?.authorId === user?.id;
  console.log(hasAccess)
  return true ? (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  ) : <Navigate to="/login" />;
};