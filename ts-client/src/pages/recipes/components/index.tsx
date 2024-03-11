import { useContext, useState } from "react";

// components
import Pagination from '@mui/material/Pagination';
import Collapse from '@mui/material/Collapse';
import { TagSearch } from "./tag-search";
import { RecipeSearch } from "./recipe-search";
import { RecipeCard } from "./recipe-card";

// services
import AuthContext from "@/services/contexts/authContext";
import { useRecipeSearch } from "../hooks/useRecipeSearch";

// types
import { AuthContextType } from "@/services/contexts/models";

const LoadingRecipe = () => {
  return (
    <div className="flex flex-col justify-center relative py-5 w-80 border-b animate-pulse">
      <div className="size-80 items-center flex overflow-hidden bg-slate-200" />
      <div className="px-3 min-h-32">
        <div className="text-xs h-8 line-clamp-2 bg-slate-200 text-wrap" />
      </div>
    </div>
  )
};

export const Recipes = () => {

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([])
  const [page, setPage] = useState(1);

  const searchFn = useRecipeSearch({ userId });
  const { data: recipes, isLoading } = searchFn({ title, page, tags })

  const [expanded, setExpanded] = useState(false);


  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex space-x-5">
          <RecipeSearch title={title} setTitle={setTitle} />
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
          {Array.from(Array(20).keys()).map((_, index) =>
            <LoadingRecipe key={index} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex space-x-5">
        <RecipeSearch title={title} setTitle={setTitle} />
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
      {recipes?.length ? (
        <div className="flex flex-wrap gap-x-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 text-lg italic justify-self-center">
          It appears no recipes match your criteria... <br />
          How about you create one using the add button in the search bar
        </div>
      )}
      <Pagination
        count={10}
        page={page}
        onChange={(_, page) => setPage(page)}
      />
    </div>
  )
};

export default Recipes;