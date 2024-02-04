import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom"
import { getRecipeGallery } from "../../api/profile";
import StyledRating, { LightStyledRating } from "../styled-components/rating";
import { useState } from "react";
import { Collapse } from "@mui/material";
import * as light from '../../assets/icons/light'


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const RecipeTile = ({ recipe, setSelected, disableClick, setDisabled }) => {

  const [hovered, setHovered] = useState(false)

  const handleClick = async () => {
    setSelected(null);
    setDisabled(true);
    setTimeout(() => {
      setSelected(recipe);
      setDisabled(false)
    }, 500);
  }

  return (
    <button
      className="size-44 min-w-44 relative border-2 border-transparent hover:border-orange-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      disabled={disableClick}
    >
      <img src={recipe.image} alt="recipe photo"
        className="object-cover h-full w-full"
      />
      {hovered && (
        <div className="absolute bg-black/20 inset-0 flex justify-center items-center">
          <LightStyledRating value={recipe.averageRating} precision={0.1} readOnly />
        </div>
      )}
    </button>
  );
};

const RecipeProfile = ({ recipe, setSelected, setDisabled }) => {

  if (!recipe) {
    return (
      <div className=" max-h-96 border-2 border-transparent flex animate-pulse">
        <div className="w-1/2 flex flex-col justify-center items-center px-10 border-l-2 border-orange-300">
        </div>
        <div className="aspect-square w-1/2 bg-slate-100">
        </div>
      </div>
    );
  };

  // Extract the date in a more readable format
  let d = new Date(recipe?.createdOn);
  const month = months[d.getMonth()];
  const date = d.getDate()
  const year = d.getFullYear()

  const editors = recipe?.editors;
  const author = recipe?.author;


  const handleCloseProfile = () => {
    setDisabled(true);
    setSelected(null);
    setTimeout(() => setDisabled(false), 500)
  }


  return (
    <div className="max-h-96 border-2 border-transparent flex">
      <div className="w-1/2 flex flex-col justify-center relative items-center px-10 border-l-2 border-orange-300">
        {/* <section className="mb-8">
              <Tags editing={editing} />
            </section> */}
        <Link className="text-4xl capitalize mb-5 px-10 text-center hover:underline" to={`/recipes/${recipe.id}`}>
          {recipe?.title}
        </Link>
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
        <div className="text-xs text-center py-4">
          {recipe?.description}
        </div>
        <div className="text-lg space-x-3 capitalize flex items-center">
          <StyledRating value={recipe?.averageRating} precision={0.1} readOnly />
        </div>
        <button
          className="border-2 border-slate-950 absolute top-0 left-2"
          onClick={handleCloseProfile}
        >
          <img src={light.CloseRing} alt={"close recipe"} />
        </button>
      </div>
      <div className="aspect-square w-1/2">
        <img
          src={recipe?.image} alt={`display photo - ${recipe?.title}`}
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  )
}


const RecipeGallery = () => {
  const { userId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['gallery', userId],
    queryFn: () => getRecipeGallery({ userId })
  });

  const empty = 10 - data?.length

  const [selected, setSelected] = useState(null);
  const [disableClick, setDisabled] = useState(false);

  return (
    <>
      <div className="space-x-3 mb-3 flex flex-row overflow-x-auto">
        {data?.map((el, index) =>
          <RecipeTile key={index} recipe={el} setSelected={setSelected} disableClick={disableClick} setDisabled={setDisabled} />
        )}
        { empty ? Array.from(Array(empty).keys()).map((_, index) =>
          <div key={index} className="size-44 min-w-44 border-2 "/>
        ) : null}
      </div>
      <Collapse
        in={selected ? true : false}
        timeout="auto"
        unmountOnExit
      >
        <RecipeProfile recipe={selected} setSelected={setSelected} setDisabled={setDisabled} />
      </Collapse>
    </>
  )
};

export default RecipeGallery;