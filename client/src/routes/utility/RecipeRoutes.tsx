import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import AuthContext from "../../context/auth";
import { useQuery } from "@tanstack/react-query";
import { getRecipe } from "../../api/recipe";
import { getConnections } from "../../api/user";

export const RecipeRouteAuth = () => {

  const { recipeId } = useParams();

  const { data: recipe, isLoading: recipeLoading, isError } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const { user } = useContext(AuthContext);

  const { data: connections, isLoading: connectionsLoading } = useQuery({
    queryKey: ["my-connections", user],
    queryFn: () => getConnections()
  });

  if (recipeLoading) {
    return (
      <div></div>
    );
  };

  if (recipe?.public) {
    return (
      <Outlet />
    );
  };

  if (!user) {
    return (
      <Navigate to="/login" />
    )
  }


  if (connectionsLoading) {
    return (
      <div></div>
    );
  };

  const hasAccess = connections?.map(({ id }) => id).includes(recipe?.authorId) || recipe?.authorId === user?.id;
  return hasAccess ? <Outlet /> : <Navigate to="/login" />;
};