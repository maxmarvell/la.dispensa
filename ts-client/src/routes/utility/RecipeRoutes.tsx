import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// context
import AuthContext from "../../context/auth";

// services
import { getRecipe } from "../../api/recipe";
import { getConnections } from "../../api/user";

// types
import { AuthContextType } from "../../@types/context";

export const RecipeRouteAuth = () => {

  const { recipeId } = useParams();
  const { user } = useContext(AuthContext) as AuthContextType;

  const { data: recipe, isLoading: recipeLoading } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

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

  if (!recipe?.authorId) return <Navigate to="/login" />;

  const hasAccess = connections?.map(({ id }) => id).includes(recipe?.authorId) || recipe?.authorId === user?.id;
  return hasAccess ? <Outlet /> : <Navigate to="/login" />;
};