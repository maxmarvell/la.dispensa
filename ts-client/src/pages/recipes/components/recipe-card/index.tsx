import { Link } from "react-router-dom";
import { formatDate } from "@/utils/date-format";

// services
import { useAggregatedRating } from "@/pages/recipe/hooks/useAggregatedRating";

// components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import StyledRating from "@/components/styled-components/rating";

// types
import { RecipeCardProps } from "../../models";


export const RecipeCard = ({ recipe }: RecipeCardProps) => {

  const { id: recipeId } = recipe;

  const { data: aggregatedRating } = useAggregatedRating({ recipeId })

  const _avg = Math.round(aggregatedRating?._avg?.value || 0 * 100) / 100;

  // extract the date in a more readable format
  const {month, date, year} = formatDate(new Date(recipe.createdOn))
  

  return (
    <Link to={`/recipes/${recipe.id}/`} className="flex flex-col justify-center relative py-5 w-80 border-b">
      <div
        className="size-80 items-center flex overflow-hidden"
      >
        <Avatar>
          <AvatarImage src={recipe.image} />
          <AvatarFallback>{recipe.title?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="px-3 min-h-32">
        <div className="italic text-sm flex justify-between">
          <p>{recipe.author.username}</p>
          <p>{date}/{month}/{year}</p>
        </div>
        <div className="text-xl font-bold line-clamp-1 hover:underline my-2">
          {recipe.title}
        </div>
        <div className="text-xs h-8 line-clamp-2 text-slate-600 text-wrap">
          {recipe.description}
        </div>
        <div className="flex justify-center pt-5">
          <StyledRating readOnly value={_avg || 0} />
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard;