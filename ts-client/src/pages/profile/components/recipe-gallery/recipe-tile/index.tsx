import { Link } from "react-router-dom";
import { useState } from "react";

// ui components
import { LightStyledRating } from "@/components/styled-components/rating";

// types
import { RecipeGalleryType } from "@/pages/profile/models";
import { formatDate } from "@/utils/date-format";

export const RecipeTile = ({ recipe }: { recipe: RecipeGalleryType }) => {

  const [hovered, setHovered] = useState(false)

  // Extract the date in a more readable format
  const { month, date, year } = formatDate(new Date(recipe.createdOn));

  // get author
  const editors = recipe.editors;
  const author = recipe.author;

  // extract other details
  const { rating, image, id, title } = recipe;

  return (
    <Link
      to={`/recipes/${id}`}
      className="grow size-64 min-w-64 relative border-2 border-transparent hover:border-orange-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={image} alt="recipe photo"
        className="object-cover h-full w-full"
      />
      {hovered && (
        <div className="absolute bg-black/20 text-white inset-0 flex flex-col justify-center items-center">
          <div className="text-2xl capitalize mb-5 px-10 text-center hover:underline">
            {title}
          </div>
          <div className="text-xs uppercase ">
            Authored By {author?.username}
          </div>
          {editors?.length ? (
            <div className="text-xs uppercase mb-1">
              Edited By {editors?.map(el => el.username).join(', ')}
            </div>
          ) : null}
          <div className="text-xs text-gray-400 capitalize">
            {month} {date}, {year}
          </div>
          <LightStyledRating value={rating?._avg?.value} precision={0.1} readOnly />
        </div>
      )}
    </Link>
  );
};