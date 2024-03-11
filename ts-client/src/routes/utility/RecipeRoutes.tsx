import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

// services
import { useRecipe } from "@/services/hooks/recipe/useRecipe";
import { useConnections } from "@/services/hooks/connections/useConnections";
import AuthContext from "@/services/contexts/authContext";

// types
import { AuthContextType } from "@/services/contexts/models";

export const RecipeRouteAuth = () => {

  // get recipe id and current user
  const { recipeId } = useParams();
  const { user } = useContext(AuthContext) as AuthContextType;

  if (!recipeId) throw new Error("id of recipe is required!")

  const { getRecipeById } = useRecipe();
  const { data: recipe, isLoading: recipeLoading } = getRecipeById({ recipeId })

  const { getConnections: { data: connections, isLoading: connectionsLoading } } = useConnections({ userId: user?.id });

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