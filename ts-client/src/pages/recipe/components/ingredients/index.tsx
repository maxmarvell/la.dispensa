import { useParams } from "react-router-dom";
import { useContext } from "react";

import { UpdateIngredients } from "./update-ingredients";
import { CreateIngredients } from "./create-ingredients";

// services
import AuthContext from "@/services/contexts/authContext";
import { useIngredient } from "../../hooks/useIngredient";
import { useRecipe } from "@/services/hooks/recipe/useRecipe";

// types
import { AuthContextType } from "@/services/contexts/models";
import { IngredientFieldProps } from "../../models";

const Field = ({ ingredient }: IngredientFieldProps) => {
  const { ingredient: { name }, quantity, unit } = ingredient;
  return (
    <div className="flex justify-between items-center pl-2 py-1 odd:bg-white even:bg-slate-100">
      <div className="flex space-x-2">
        <span className="capitalize">{name}</span>
        <span className="lowercase">{quantity} {unit}</span>
      </div>
    </div >
  );
};

export const Ingredients = () => {

  // Extract recipe id and user
  const { recipeId } = useParams();
  const { user } = useContext(AuthContext) as AuthContextType;

  // Retrieve the recipe and extract the author id
  const { getRecipeById } = useRecipe();
  const { data: recipe } = getRecipeById({ recipeId })
  const authorId = recipe?.authorId;

  // fetch the ingredients
  const { getIngredients: { data, isLoading } } = useIngredient({ recipeId });

  // map the components
  const ingredients = data?.ingredients;
  const components = data?.components?.map(({ amount, component: { title, ingredients } }) => ({
    title,
    ingredients: ingredients.map(({ quantity, ...rest }) => (
      { quantity: quantity * amount, ...rest }
    ))
  }));

  if (isLoading) {
    return (
      <div></div>
    );
  };

  // If the user is not the author render uneditable fields
  if (authorId !== user?.id) {
    return (
      <div className="text-sm divide-y">
        <div className="py-1 first:pt-0 last:pb-0">
          {ingredients?.map((el, index) => (
            <Field ingredient={el} key={index} />
          ))}
        </div>
        {components?.map(({ title, ingredients }, index) =>
          <div className="pb-1 pt-1 last:pb-0" key={index}>
            <div className="italic text-lg">For the {title}</div>
            {ingredients?.map((el, index) => (
              <Field ingredient={el} key={index} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="divide-y text-sm">
      <div className="space-y-1">
        <UpdateIngredients />
        <CreateIngredients />
      </div>
      {components?.map(({ title, ingredients }, index) =>
        <div className="pb-1 pt-1 last:pb-0" key={index}>
          <div className="italic text-lg">For the {title}</div>
          {ingredients?.map((el, index) => (
            <Field ingredient={el} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};