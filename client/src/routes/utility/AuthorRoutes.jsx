import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import AuthContext from "../../context/auth";
import { getRecipe } from "../../api/recipe";
import { useQuery } from "@tanstack/react-query";

const AuthorRoutes = () => {
	const { user } = useContext(AuthContext);

  const { recipeId } = useParams();

  const { isLoading, isError, data: recipe, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  if (isLoading) {
    return (
      <div></div>
    )
  }

  const canAccess = (recipe.authorId === user.id);

	return canAccess ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthorRoutes;