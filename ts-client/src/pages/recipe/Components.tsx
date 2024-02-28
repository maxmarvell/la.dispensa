import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { connectComponent, getAvailableComponents, getComponents, removeComponentConnection } from "../../api/recipe";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../context/auth";
import ImgNotAvailable from "../../assets/Image_not_available.png"
import * as light from "../../assets/icons/light"
import Pagination from '@mui/material/Pagination';
import { AuthContextType } from "../../@types/context";
import { DashboardRecipesType } from "../../@types/dashboard";
import { BaseComponent } from "../../@types/components";

const sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const take = 12;

type cardType = {
  recipe: DashboardRecipesType,
  setActive: React.Dispatch<React.SetStateAction<DashboardRecipesType | null>>
}

const ComponentCard = ({ recipe, setActive }: cardType) => {
  return (
    <button
      className="size-44 relative items-center flex overflow-hidden 
                 focus:outline-none focus:ring-4 ring-orange-300
                 ring-offset-1"
      onClick={() => setActive(recipe)}
    >
      <img
        src={(recipe.image) ? (
          recipe.image
        ) : (
          ImgNotAvailable
        )}
        className="object-cover h-full w-full"
      />
      <div
        className="absolute bottom-0 left-0 h-8 w-full
                 bg-black/50 flex justify-center items-center
                 text-white cursor-pointer text-center"
      >
        <p className="text-xs w-8/12">{recipe.title}</p>
      </div>
    </button>
  )
}

const ActiveComponentCard = ({ data }: {data: BaseComponent}) => {

  const { component, componentId, recipeId } = data;

  const queryClient = useQueryClient();

  const { mutateAsync: removeConnection } = useMutation({
    mutationFn: removeComponentConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['componentSearch, components']})
    }
  })

  const handleRemove = () => {
    removeConnection({
      componentId,
      recipeId
    })
  }

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="size-44 relative items-center flex overflow-hidden 
                 focus:outline-none focus:ring-4 ring-orange-300
                 ring-offset-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={(component.image) ? (
          component.image
        ) : (
          ImgNotAvailable
        )}
        className="object-cover h-full w-full"
      />
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
          <img src={light.RemoveFill} alt="" />
        </div>
      )}
    </div>
  )
}

const DetailedRecipe = ({ recipe, setActive }: cardType) => {

  const { recipeId } = useParams();

  const { id: componentId } = recipe;

  const queryClient = useQueryClient();

  const { mutateAsync: addConnection } = useMutation({
    mutationFn: connectComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['componentSearch, components'] })
    }
  });

  const handleConnect = async () => {
    let result = await addConnection({
      recipeId,
      data: {
        componentId,
        amount
      }
    })
    if (result) {
      setActive(null)
    }
  }

  const [amount, setAmount] = useState<null | string>(null)

  return (
    <div>
      <div>
        <button
          className="p-1 bg-slate-950 mb-2 hover:bg-orange-300"
          onClick={() => setActive(null)}
        >
          <img src={light.RefundBack} alt="" />
        </button>
      </div>
      <div className="flex">
        <div
          className="size-64 min-w-64 relative items-center flex overflow-hidden 
                     focus:outline-none focus:ring-4 ring-orange-300
                     ring-offset-1"
        >
          <img
            src={(recipe.image) ? (
              recipe.image
            ) : (
              ImgNotAvailable
            )}
            className="object-cover h-full w-full"
          />
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
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="bg-slate-950 hover:bg-orange-300"
              onClick={handleConnect}
            >
              <img src={light.AddFill} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Components() {

  // auth
  const { user } = useContext(AuthContext) as AuthContextType;
  const authorId = user?.id;

  // params
  const { recipeId } = useParams();
  const [title, setTitle] = useState("");

  // page state
  const [page, setPage] = useState(1);

  const { data: recipes } = useQuery({
    queryKey: ['componentSearch', recipeId, authorId, title, page],
    queryFn: () => getAvailableComponents({ recipeId, authorId, title, page, take }),
    placeholderData: keepPreviousData,
  })

  const { data: components } = useQuery({
    queryKey: ['components', recipeId],
    queryFn: () => getComponents({ recipeId })
  });

  const [active, setActive] = useState<null |DashboardRecipesType >(null)

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
              // aria-label="Search contacts"
              placeholder="Search"
              // type="search"
              // name="q"
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