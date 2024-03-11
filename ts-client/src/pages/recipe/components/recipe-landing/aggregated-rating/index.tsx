import { useParams } from "react-router-dom";
import StyledRating from "@/components/styled-components/rating";
import { useAggregatedRating } from "@/pages/recipe/hooks/useAggregatedRating";


export const AggregateRating = () => {

  const { recipeId } = useParams();

  const { data: aggregatedRating } = useAggregatedRating({ recipeId })

  const _avg = Math.round(aggregatedRating?._avg?.value || 0 * 100) / 100;
  const _count = aggregatedRating?._count;

  return (
    <>
      <span>{_avg}</span>
      <StyledRating name="read-only" value={_avg} precision={0.1} readOnly />
      <span className="text-xs text-gray-500">({_count})</span>
    </>
  );
};