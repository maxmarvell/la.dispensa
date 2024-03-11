import { useState } from "react";

// components
import { RecipeCard } from "../recipe-card";
import { RecipeCardSkeleton } from "../recipe-card/skeleton";

// hooks
import { useDashboardRecipes } from "@/pages/dashboard/hooks/useDashboardRecipes";

// consts
const defaultTake = 10;

export const RecipeFeedLayout = () => {

  const [take, _] = useState(defaultTake);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    data
  } = useDashboardRecipes({ take })

  // display laoding state
  if (isLoading) {
    return (
      <div className="flex flex-col divide-y items-center">
        {Array.from(Array(3).keys()).map(el => (
          <RecipeCardSkeleton key={el} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col divide-y items-center">
      {data?.pages?.map((page, pageIndex) => (
        page?.recipes?.map((recipe, recipeIndex) => (
          <RecipeCard
            last={(page?.recipes?.length === recipeIndex + 1) ? true : false}
            recipe={recipe}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            key={`${pageIndex}-${recipeIndex}`}
          />
        ))
      ))}
      {isFetchingNextPage ? (
        Array.from(Array(3).keys()).map(el => (
          <RecipeCardSkeleton key={el} />
        ))
      ) : null}
    </div>
  )
};