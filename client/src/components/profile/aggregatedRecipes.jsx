import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getRecipeCount } from "../../api/profile";



export const AggregatedRecipes = () => {

  const { userId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recipe-count", userId],
    queryFn: () => getRecipeCount({ userId })
  });

  if (isLoading) {
    return (
      <div className="py-1">Published x recipes</div>
    )
  }

  return (
    <div className="py-1">Published <span className="font-bold">{data}</span> recipes</div>
  )
}