import { useParams } from "react-router-dom";
import { useContext, useState } from "react";

// services
import AuthContext from "@/services/contexts/authContext";
import { useComponents } from "../hooks/useComponents";

// components
import Pagination from '@mui/material/Pagination';
import { IconArrowBackUp, IconCircleMinus, IconCirclePlus } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// types
import { AuthContextType } from "@/services/contexts/models";
import { ActiveComponentCardProps, RecipeCardProps, ActiveRecipeType } from "../models";

const sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."


const ComponentCard = ({ recipe, setActive }: RecipeCardProps) => {
  return (
    <button
      className="size-44 relative items-center flex overflow-hidden 
                 focus:outline-none focus:ring-4 ring-orange-300
                 ring-offset-1"
      onClick={() => setActive(recipe)}
    >
      <Avatar>
        <AvatarImage src={recipe.image} />
        <AvatarFallback>{recipe.title?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className="absolute bottom-0 left-0 h-8 w-full
                 bg-black/50 flex justify-center items-center
                 text-white cursor-pointer text-center"
      >
        <p className="text-xs w-8/12">{recipe.title}</p>
      </div>
    </button>
  )
};

const ActiveComponentCard = ({ data }: ActiveComponentCardProps) => {

  const { component, componentId, recipeId } = data;

  const { removeComponent } = useComponents({ recipeId })

  const handleRemove = () => {
    removeComponent.mutateAsync({ componentId })
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="size-44 relative items-center flex overflow-hidden 
                 focus:outline-none focus:ring-4 ring-orange-300
                 ring-offset-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar>
        <AvatarImage src={component.image} />
        <AvatarFallback>{component.title?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className="absolute bottom-0 left-0 h-8 w-full
                 bg-black/50 flex justify-center items-center
                 text-white cursor-pointer text-center"
      >
        <p className="text-xs w-8/12">{component.title}</p>
      </div>
      {isHovered && (
        <div
          className="absolute bottom-8 left-0 top-0 w-full
                     cursor-pointer bg-black/50 flex
                     place-content-center"
          onClick={handleRemove}
        >
          <IconCircleMinus />
        </div>
      )}
    </div>
  )
}

const DetailedRecipe = ({ recipe, setActive }: RecipeCardProps) => {

  const { recipeId } = useParams();

  const { id: componentId } = recipe;

  const { addComponent } = useComponents({ recipeId });

  const handleConnect = async () => {

    let result = await addComponent.mutateAsync({
      componentId,
      amount: amount || 0
    })
    if (result) {
      setActive(null)
    }
  }

  const [amount, setAmount] = useState<null | number>(null)

  return (
    <div>
      <div>
        <button
          className="p-1 bg-slate-950 mb-2 hover:bg-orange-300"
          onClick={() => setActive(null)}
        >
          <IconArrowBackUp />
        </button>
      </div>
      <div className="flex">
        <div
          className="size-64 min-w-64 relative items-center flex overflow-hidden 
                     focus:outline-none focus:ring-4 ring-orange-300
                     ring-offset-1"
        >
          <Avatar>
            <AvatarImage src={recipe.image} />
            <AvatarFallback>{recipe.title?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="grow my-auto text-center py-4 px-10">
          <div className="font-bold text-xl">{recipe.title}</div>
          <div className="text-xs uppercase mb-1">
            By {recipe?.author?.username}
          </div>
          <div className="text-xs text-slate-400 h-12 overflow-hidden text-ellipsis">
            {sample}
          </div>
          <div className="mt-5 mb-1 text-xs italic">
            Use the input below to add the amount of this component below
          </div>
          <div className="space-x-5 flex justify-center">
            <input
              type="number"
              className="text-base p-0 border-0 border-b-2 border-black w-12
                       focus:border-orange-300 focus:outline-none"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
            />
            <button
              className="bg-slate-950 hover:bg-orange-300"
              onClick={handleConnect}
            >
              <IconCirclePlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Components = () => {

  // auth
  const { user } = useContext(AuthContext) as AuthContextType;
  const authorId = user?.id;

  if (!authorId) throw new Error("current user must have a valid id")

  // params
  const { recipeId } = useParams();
  const [title, setTitle] = useState("");

  // page state
  const [page, setPage] = useState(1);

  const { getComponents: { data: components }, queryNewComponents } = useComponents({ recipeId });

  const { data: recipes } = queryNewComponents({ authorId, title, page });

  const [active, setActive] = useState<ActiveRecipeType>(null)

  return (
    <div className="divide-y-2 divide-dashed">
      <div className="pb-4 space-y-4">
        <div className="flex">
          <span>
            There are currently
            <span className="font-bold"> {components?.length} </span>
            components to your dish
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {components?.map((component, index) => (
            <ActiveComponentCard data={component} key={index} />
          ))}
        </div>
      </div>
      <div className="space-y-3 pt-4">
        {active ? (
          <>
            <DetailedRecipe recipe={active} setActive={setActive} />
          </>
        ) : (
          <>
            <input
              placeholder="Search"
              className="border-0 border-b-2 border-slate-950 focus:outline-none focus:border-orange-300"
              onChange={(e) => setTitle(e.target.value)}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
            <div className="flex flex-wrap gap-3">
              {recipes?.map((el, index) => (
                <ComponentCard recipe={el} setActive={setActive} key={index} />
              ))}
            </div>
            <div className="flex justify-center">
              <Pagination
                count={10}
                page={page}
                onChange={(_, page) => setPage(page)}
              />

            </div>
          </>
        )}
      </div>
    </div>
  )
}