import { createRecipe, getRecipes } from "../api/recipe";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Search, Add } from "../assets/icons";
import { useState } from "react";
import RecipeCard from "../components/recipe/card";
import Pagination from '@mui/material/Pagination';
import Collapse from '@mui/material/Collapse';
import TagSearch from "../components/index/tagSearch";
import * as light from "../assets/icons/light"

const take = 48;


const LoadingRecipe = () => {
  return (
    <div className="flex flex-col justify-center relative py-5 w-80 border-b animate-pulse">
      <div className="size-80 items-center flex overflow-hidden bg-slate-200" />
      <div className="px-3 min-h-32">
        <div className="text-xl font-bold hover:underline py-2" />
        <div className="text-xs h-8 line-clamp-2 bg-slate-200 text-wrap" />
      </div>
    </div>
  )
}


export default function Recipes() {

  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([])
  const [page, setPage] = useState(1);

  const { isLoading, isError, data: recipes, error } = useQuery({
    queryKey: ['recipes', title, page, tags],
    queryFn: () => getRecipes({ title, page, take, tags }),
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: addRecipeMutation } = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes', title, page, tags])
    }
  });

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const [expanded, setExpanded] = useState(false);


  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex space-x-5">
          <div
            className="w-1/2 min-w-12 flex justify-between border-0 
                     border-b-2 border-slate-950 focus-within:border-orange-300">
            <img src={Search} alt="search" />
            <input
              type="input"
              onChange={handleInputChange}
              value={title}
              placeholder="Search the title of the recipe"
              className="border-none w-5/6 mx-2 focus:outline-none"
            />
            <div className="sr-only" aria-live="polite"></div>
            <button onClick={async () => {
              try {
                await addRecipeMutation({ title });
              } catch (e) {
                console.error(e);
              }
            }} className="min-w-fit">
              <img src={Add} alt="add" />
            </button>
          </div>
          <div className="flex items-center">
            <button
              className="text-white text-xs uppercase bg-slate-950 px-2 py-1
                       hover:bg-orange-300"
            >
              Filters
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 ">
          {Array.from(Array(take).keys()).map((_, index) =>
            <LoadingRecipe key={index} />
          )}
        </div>
        <Pagination
          count={10}
          page={page}
          onChange={(_, page) => setPage(page)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex space-x-5">
        <div
          className="w-1/2 min-w-12 flex justify-between border-0 
                     border-b-2 border-slate-950 focus-within:border-orange-300">
          <img src={Search} alt="search" />
          <input
            type="input"
            onChange={handleInputChange}
            value={title}
            placeholder="Search the title of the recipe"
            className="border-none w-5/6 mx-2 focus:outline-none"
          />
          <div className="sr-only" aria-live="polite"></div>
          <button onClick={async () => {
            try {
              await addRecipeMutation({ title });
            } catch (e) {
              console.error(e);
            }
          }} className="min-w-fit">
            <img src={Add} alt="add" />
          </button>
        </div>
        <div className="flex items-center text-white text-xs">
          <button
            className="uppercase bg-slate-950 px-2 py-1
                       hover:bg-orange-300 mr-5"
            onClick={() => setExpanded(!expanded)}
          >
            Filters
          </button>
        </div>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TagSearch selectedTags={tags} setSelectedTags={setTags} />
      </Collapse>
      <div className="flex flex-wrap gap-x-8 ">
        {recipes?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
          />
        ))}
      </div>
      <Pagination
        count={10}
        page={page}
        onChange={(_, page) => setPage(page)}
      />
    </div>
  )
}