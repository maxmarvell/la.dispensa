import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAggregatedRating } from "../../api/recipe";
import StyledRating from "../styled-components/rating";



const AggRating = () => {

  const { recipeId } = useParams();

  const { data: aggregatedRating } = useQuery({
    queryKey: ['aggregatedRating', recipeId],
    queryFn: () => getAggregatedRating({ recipeId })
  })

  const _avg = Math.round(aggregatedRating?._avg?.value, 2) || 0.0;
  const _count = aggregatedRating?._count;

  return (
    <>
      <span>{_avg}</span>
      <StyledRating name="read-only" value={_avg} precision={0.1} readOnly />
      <span className="text-xs text-gray-500">({_count})</span>
    </>
  );
};


export default AggRating;