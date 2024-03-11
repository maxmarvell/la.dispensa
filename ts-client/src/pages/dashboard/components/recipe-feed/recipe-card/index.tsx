import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// components
import StyledRating from "@/components/styled-components/rating";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// hooks
import { useOnScreen } from "@/pages/dashboard/hooks/useOnScreen";

// types
import { RecipeCardType } from "@/pages/dashboard/models";

export const RecipeCard = ({ recipe, last, hasNextPage, fetchNextPage }: RecipeCardType) => {

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
          <Avatar className="rounded-full max-w-10 aspect-square">
            <AvatarImage src={recipe.author.image} />
            <AvatarFallback>{recipe.author.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
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
            <StyledRating name="read-only" value={rating?._avg.value} precision={0.1} readOnly />
            <span className="text-gray-500">({rating?._count || 0})</span>
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

    const infiniteScrollRef = useRef<HTMLDivElement | null>(null)
    const onScreen = useOnScreen({ infiniteScrollRef });

    useEffect(() => {
      if (onScreen && hasNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, onScreen, fetchNextPage]);

    return (
      <div className="lg:max-w-lg sm:max-w-72 py-10" ref={infiniteScrollRef}>
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
