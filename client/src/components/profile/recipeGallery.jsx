import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom"
import { getRecipeGallery } from "../../api/profile";
import { LightStyledRating } from "../styled-components/rating";
import { useState } from "react";


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const RecipeTile = ({ recipe }) => {

  const [hovered, setHovered] = useState(false)


  // Extract the date in a more readable format
  let d = new Date(recipe?.createdOn);
  const month = months[d.getMonth()];
  const date = d.getDate()
  const year = d.getFullYear()

  const editors = recipe?.editors;
  const author = recipe?.author;

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="grow size-64 min-w-64 relative border-2 border-transparent hover:border-orange-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={recipe.image} alt="recipe photo"
        className="object-cover h-full w-full"
      />
      {hovered && (
        <div className="absolute bg-black/20 text-white inset-0 flex flex-col justify-center items-center">
          <div className="text-2xl capitalize mb-5 px-10 text-center hover:underline">
            {recipe?.title}
          </div>
          <div className="text-xs uppercase ">
            Authored By {author?.username}
          </div>
          {editors?.length ? (
            <div className="text-xs uppercase mb-1">
              Edited By {editors?.map(el => el.user.username).join(', ')}
            </div>
          ) : null}
          <div className="text-xs text-gray-400 capitalize">
            {month} {date}, {year}
          </div>
          <LightStyledRating value={recipe.averageRating} precision={0.1} readOnly />
        </div>
      )}
    </Link>
  );
};

const RecipeGallery = () => {
  const { userId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['gallery', userId],
    queryFn: () => getRecipeGallery({ userId })
  });


  return (
    <div className="flex flex-wrap gap-1">
      {data?.map((el, index) =>
        <RecipeTile key={index} recipe={el} />
      )}
    </div>
  )
};

export default RecipeGallery;