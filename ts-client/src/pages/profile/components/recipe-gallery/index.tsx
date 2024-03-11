import { useParams } from "react-router-dom"

// components
import { RecipeTile } from "./recipe-tile";

// services
import { useRecipeGallery } from "../../hooks/useRecipeGallery";

export const RecipeGallery = () => {

  // get userId of profile
  const { userId } = useParams();

  // fetch the gallery
  const { data } = useRecipeGallery({ userId });

  return (
    <div className="flex flex-wrap gap-1">
      {data?.map((el, index) =>
        <RecipeTile key={index} recipe={el} />
      )}
    </div>
  )
};