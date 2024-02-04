import { Link } from "react-router-dom";
import ImgNotAvailable from "../../assets/Image_not_available.png";
import { getAggregatedRating } from "../../api/recipe";
import { useQuery } from "@tanstack/react-query";
import StyledRating from "../styled-components/rating";


const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

const RecipeCard = ({ recipe }) => {

  const { id: recipeId } = recipe;

  const { data: aggregatedRating } = useQuery({
    queryKey: ['aggregatedRating', recipeId],
    queryFn: () => getAggregatedRating({ recipeId })
  })

  const _avg = Math.round(aggregatedRating?._avg?.value, 2) || null;

  // Extract the date in a more readable format
  let d = new Date(recipe.createdOn);
  const month = months[d.getMonth()];
  const date = d.getDate()
  const year = d.getFullYear()

  return (
    <Link to={`/recipes/${recipe.id}/`} className="flex flex-col justify-center relative py-5 w-80 border-b">
      <div
        className="size-80 items-center flex overflow-hidden"
      >
        <img
          src={(recipe.image) ? (
            recipe.image
          ) : (
            ImgNotAvailable
          )}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="px-3 min-h-32">
        <div className="italic text-sm flex justify-between">
          <p>{recipe.author.username}</p>
          <p>{date}/{month}/{year}</p>
        </div>
        <div className="text-xl font-bold hover:underline py-2">
          {recipe.title}
        </div>
        <div className="text-xs h-8 line-clamp-2 text-slate-600 text-wrap">
          {recipe.description}
        </div>
        <div className="flex justify-center pt-5">
          <StyledRating readOnly value={_avg} />
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard;