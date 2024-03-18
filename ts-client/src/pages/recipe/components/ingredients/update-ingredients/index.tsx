import { useState } from "react";
import { useParams } from "react-router-dom";

// types
import { useIngredient } from "@/pages/recipe/hooks/useIngredient";
import { BaseRecipeIngredientType } from "@/types/recipe";

// components
import { IconDeviceFloppy, IconCircleMinus } from "@tabler/icons-react";
import { IngredientInput } from "@/components/ingredients/input";
import { Button } from "@/components/ui/button";

export const UpdateIngredients = () => {

  // extract recipe id
  const { recipeId } = useParams();

  // fetch the ingredients
  const { getIngredients: { data } } = useIngredient({ recipeId });

  const { removeIngredient, updateIngredient } = useIngredient({ recipeId });

  // set the selected option
  const [ingredients, setIngredients] = useState<BaseRecipeIngredientType[]>(data?.ingredients || [])

  const setQuantityField = ({ quantity, ingredientId }: { quantity: number, ingredientId: string }) => setIngredients(prev => (
    prev.map(el => (
      el.ingredientId === ingredientId ? { ...el, quantity: quantity } : el
    ))
  ));

  const setUnitField = ({ unit, ingredientId }: { unit: "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined, ingredientId: string }) => setIngredients(prev => (
    prev.map(el => (
      el.ingredientId === ingredientId ? { ...el, unit: unit } : el
    ))
  ));

  // save the updates
  const handleUpdate = async ({ ingredientId, ingredient }: { ingredientId: string, ingredient: BaseRecipeIngredientType }) => {
    await updateIngredient.mutateAsync({
      ingredientId,
      input: ingredient,
    });
  };

  const handleDelete = async ({ ingredientId }: { ingredientId: string }) => {
    await removeIngredient.mutateAsync({ ingredientId });
  }

  return (
    <>
      {ingredients?.map((ingredient) => {
        let { ingredientId } = ingredient;
        return <div className="flex space-x-1" key={ingredientId}>
          <IngredientInput
            key={ingredientId}
            ingredient={ingredient}
            setIngredient={{
              quantityChange: ({ quantity }: { quantity: number }) => setQuantityField({ quantity, ingredientId }),
              unitChange: ({ unit }: { unit: "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined }) => setUnitField({ unit, ingredientId }),
            }}
            disabled={true}
          />
          <Button
            onClick={() => handleUpdate({ ingredientId, ingredient })}
            className="p-0 aspect-square hover:bg-orange-300 hover:text-slate-950"
          >
            <IconDeviceFloppy />
          </Button>
          <Button
            onClick={() => handleDelete({ ingredientId })}
            className="p-0 aspect-square hover:bg-orange-300 hover:text-slate-950"
          >
            <IconCircleMinus />
          </Button>
        </div>
      })}
    </>
  );
};