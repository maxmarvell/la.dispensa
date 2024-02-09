import { getDashboardRecipes } from "../../api/dashboard"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import StyledRating from "../styled-components/rating";
import LoadingSpinner from "../styled-components/loadingSpinner";

export function useOnScreen(ref) {

  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  ), [ref])


  useEffect(() => {
    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
      return () => observer.disconnect();
    }

    return () => { };
  }, [observer, ref]);

  return isIntersecting
}

function RecipeCard({ recipe, last, hasNextPage, fetchNextPage }) {

  const { tags, review, rating } = recipe;

  const Content = () => (
    <>
      <section
        className="flex relative"
      >
        <Link
          to={`/profile/${recipe.authorId}`}
          className="flex items-center space-x-3 mb-2"
        >
          <div className="max-w-10  aspect-square">
            <img
              src={recipe.author.image} alt=""
              className="object-cover h-full w-full rounded-full"
            />
          </div>
          <div className="hover:underline">
            {recipe.author.username}
          </div>
        </Link>
        <div className="flex space-x-3 text-xs absolute top-1/2 -translate-y-1/2 right-3">
          {tags?.map(({ name }, index) =>
            <div
              className="bg-slate-950 flex text-white px-2 capitalize py-1"
              key={index}
            >
              {name}
            </div>
          )}
        </div>
      </section>
      <section className="relative aspect-[5/6] mb-2">
        <Link
          to={`/recipes/${recipe.id}`}
        >
          <img
            className="object-cover rounded-sm h-full w-full"
            src={recipe.image}
            alt="example"
          />
        </Link>
      </section>
      <section className="">
        <Link
          className="text-xl hover:underline"
          to={`/recipes/${recipe.id}`}
        >
          <div className="mb-2">{recipe.title}</div>
        </Link>
        <div className="text-sm mb-1">
          {recipe.description}
        </div>
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center space-x-1">
            <StyledRating name="read-only" value={rating._avg.value} precision={0.1} readOnly />
            <span className="text-gray-500">({rating._count})</span>
          </div>
          {review ? (
            <div>{review._count} reviews</div>
          ) : (
            <div>Be the first to leave a review</div>
          )}
        </div>
      </section>
    </>
  )


  if (last) {

    const ref = useRef(null)
    const onScreen = useOnScreen(ref);

    useEffect(() => {
      if (onScreen && hasNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, onScreen, fetchNextPage]);

    return (
      <div className="lg:max-w-lg sm:max-w-72 py-10" ref={ref}>
        <Content />
      </div>
    )
  };

  return (
    <div className="lg:max-w-lg sm:max-w-72 py-10">
      <Content />
    </div>
  );
};


const LoadingRecipeCard = () => {
  return (
    <div className="lg:min-w-[32rem] sm:w-72 py-10 animate-pulse">
      <section
        className="mb-2 w-full flex items-center space-x-3"
      >
        <div className="w-10 bg-slate-300 rounded-full aspect-square" />
        <div className="bg-slate-300 w-1/3 rounded-full h-4" />
      </section>
      <section className="relative aspect-[5/6] w-full bg-slate-300 mb-2" />
      <section className="">
        <div className="h-6 rounded-full w-2/3 mb-2 bg-slate-300" />
        <div className="h-2 rounded-full w-full mb-1 bg-slate-300" />
        <div className="h-2 rounded-full w-full mb-1 bg-slate-300" />
        <div className="h-2 rounded-full w-full mb-1 bg-slate-300" />
      </section>
    </div>
  )
}


const RecipeFeed = () => {

  const { data, error, isLoading, hasNextPage, fetchNextPage, isSuccess, isFetchingNextPage } = useInfiniteQuery({
    queryFn: ({ pageParam = "" }) => getDashboardRecipes({ take: 3, lastCursor: pageParam }),
    queryKey: ["dashboardRecipes"],
    getNextPageParam: (lastPage) => {
      return lastPage?.lastCursor;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col divide-y items-center">
        {Array.from(Array(10).keys()).map(el => (
          <LoadingRecipeCard key={el} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col divide-y items-center">
      {data?.pages?.map((page, pageIndex) => (
        page?.recipes?.map((recipe, recipeIndex) => (
          <RecipeCard
            last={(page.recipes.length === recipeIndex + 1) ? true : false}
            recipe={recipe}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            key={`${pageIndex}-${recipeIndex}`}
          />
        ))
      ))}
      {isFetchingNextPage ? (
        Array.from(Array(3).keys()).map(el => (
          <LoadingRecipeCard key={el} />
        ))
      ) : null}
    </div>
  )
}

export default RecipeFeed