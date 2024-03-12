import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

// services
import AuthContext from "@/services/contexts/authContext";
import { useRecipe } from "@/services/hooks/recipe/useRecipe";
import { SocketProvider } from "@/services/contexts/socketContext";

// types
import { AuthContextType } from "@/services/contexts/models";
import { useEditor } from "@/pages/recipe/recipe-permissions/hooks/useEditor";

export const ProtectTestKitchenRoutes = () => {

  const { recipeId } = useParams();

  const { user } = useContext(AuthContext) as AuthContextType;

  const { getRecipeById } = useRecipe();
  const { data: recipe, isLoading: recipeLoading } = getRecipeById({ recipeId })

  const { getEditors: { data, isLoading } } = useEditor({ recipeId })

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

  return hasAccess ? (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  ) : <Navigate to="/login" />;
};