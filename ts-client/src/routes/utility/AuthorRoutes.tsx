import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

// services
import AuthContext from "@/services/contexts/authContext";
import { useRecipe } from "@/services/hooks/recipe/useRecipe";

// types
import { AuthContextType } from "@/services/contexts/models";

export const AuthorRoutes = () => {
  const { user } = useContext(AuthContext) as AuthContextType;

  const { recipeId } = useParams();

  const { getRecipeById } = useRecipe();
  const { data: recipe, isLoading } = getRecipeById({ recipeId })

  if (isLoading) {
    return (
      <div></div>
    )
  }

  // check the user is the author
  const canAccess = (recipe?.authorId === user?.id);

  return canAccess ? <Outlet /> : <Navigate to="/login" />;
};