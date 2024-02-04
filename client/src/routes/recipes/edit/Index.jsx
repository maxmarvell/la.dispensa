import { useQuery } from "@tanstack/react-query";
import { getRecipe } from "../../../api/recipe";
import { NavLink, Outlet, useParams } from "react-router-dom";

const Navigator = ({ to, title }) => {
  return (
    <NavLink
      className={({ isActive, isPending }) =>
        isActive
          ? 'font-bold'
          : isPending
            ? 'pending'
            : ''
      }
      to={to}
    >
      {title}
    </NavLink>
  )
}

export default function Index() {

  const { recipeId } = useParams();

  const { isPending, isError, data: recipe, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  return (
    <div className="flex divide-x-2 h-full relative">
      <div className="mr-4 space-y-5 flex flex-col absolute h-full capitalize left-0">
        <NavLink
          className={({ isActive, isPending }) =>
            isActive
              ? 'font-bold'
              : isPending
                ? 'pending'
                : ''
          }
          to={`/recipes/${recipe?.id}/edit`} end
        >
          {"description"}
        </NavLink>
        <Navigator
          to={`/recipes/${recipe?.id}/edit/instructions`}
          title={"instructions"}
        />
        <Navigator
          to={`/recipes/${recipe?.id}/edit/ingredients`}
          title={"ingredients"}
        />
        <Navigator
          to={`/recipes/${recipe?.id}/edit/components`}
          title={"components"}
        />
      </div>
      <div className="w-5/6 absolute p-3 h-full overflow-y-scroll right-0">
        <Outlet />
      </div>
    </div>
  )
}