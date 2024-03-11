
import { useAggregatedRecipes } from "@/pages/profile/hooks/useAggregatedRecipes";
import { useParams } from "react-router-dom"


export const AggregatedRecipes = () => {

  const { userId } = useParams();

  const { data, isLoading } = useAggregatedRecipes({ userId });

  if (isLoading) {
    return (
      <div className="py-1">Published x recipes</div>
    )
  }

  return (
    <div className="py-1">Published <span className="font-bold">{data}</span> recipes</div>
  )
}