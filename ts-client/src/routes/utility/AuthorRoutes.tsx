import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import AuthContext from "../../context/auth";
import { getRecipe } from "../../api/recipe";
import { useQuery } from "@tanstack/react-query";

// types
import { AuthContextType } from "../../@types/context";

export const AuthorRoutes = () => {
	const { user } = useContext(AuthContext) as AuthContextType;

  const { recipeId } = useParams();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  if (isLoading) {
    return (
      <div></div>
    )
  }

  // check the user is the author
  const canAccess = (recipe?.authorId === user?.id);

	return canAccess ? <Outlet /> : <Navigate to="/login" />;
};