import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { get as getIngredients } from "../../../api/ingredients";
import { getComponents } from "../../../api/recipe";
import UpdateField from "./updateField";
import NewIngredients from "./createIngredients";

export default function Ingredients() {

  const { recipeId } = useParams();

  const { isLoading, isError, data: ingredients } = useQuery({
    queryKey: ['ingredients', recipeId],
    queryFn: () => getIngredients({ recipeId })
  });


  const { data: components } = useQuery({
    queryKey: ['components', recipeId],
    queryFn: getComponents({ recipeId })
  });

  if (isLoading) {
  }

  return (
    <div className="divide-y text-sm">
      <div className="pb-3">
        {ingredients?.map((el, index) => (
          <UpdateField
            ingredient={el}
            key={index} />
        ))}
        {components?.map((el) => {
          let { amount, component: { title, ingredients } } = el;
          let scaled = ingredients.map(({ quantity, ...rest }) => (
            { quantity: quantity * amount, ...rest }
          ))
          return (
            <>
              <div className="pb-1 pt-5 last:pb-0 text-base">For the {title}</div>
              {scaled?.map((el, index) => (
                <UpdateField
                  ingredient={el}
                  key={index} />
              ))}
            </>
          )
        })}
      </div>
      <NewIngredients />
    </div>
  );
};