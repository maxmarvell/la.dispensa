import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// services
import { useIngredient } from "@/pages/recipe/hooks/useIngredient";

// components
import { IconDeviceFloppy, IconSquareX, IconPlus } from "@tabler/icons-react";
import { IngredientInput } from "@/components/ingredients/input";
import { Button } from "@/components/ui/button";

// types
import { NewIngredientInputType } from "@/types/ingredient";

export const CreateIngredients = () => {

  const { recipeId } = useParams();

  // fetch ingredients to check if none provided
  const { getIngredients: { data }, createIngredients } = useIngredient({ recipeId });
  const ingredients = data?.ingredients;

  // allow users to be able to add ingredients
  // use state for the new input fields
  const [newIngredients, setNewIngredients] = useState<NewIngredientInputType[]>([]);
  const handleAddIngredient = () => {
    setNewIngredients(prev => [...prev, {
      ingredient: {
        name: ""
      },
      quantity: 0,
      id: crypto.randomUUID()
    }]);
  };

  // if no ingredients have been added already default to one empty field
  useEffect(() => {
    ingredients?.length === 0 ? setNewIngredients([{
      ingredient: {
        name: ""
      },
      quantity: 0,
      id: crypto.randomUUID()
    }]) : setNewIngredients([]);
  }, [ingredients]);


  const handleCreate = () => {
    createIngredients.mutateAsync({ input: newIngredients });
  };

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mt-3 mb-2">
        <Button
          variant="ghost"
          className="space-x-5"
          onClick={handleAddIngredient}
        >
          <IconPlus className="mr-2 size-5" /> Add an Ingredient?
        </Button>
      </div>
      <div className="space-y-2">
        {newIngredients.map(el =>
          <div key={el.id} className="flex space-x-2">
            <IngredientInput
              key={el.id}
              ingredient={el}
              setIngredient={{
                nameChange: ({ name }: { name: string }) => {
                  setNewIngredients(prev => prev.map(_el => el.id === _el.id ? { ..._el, ingredient: { name } } : _el))
                },
                quantityChange: ({ quantity }: { quantity: number }) => {
                  setNewIngredients(prev => prev.map(_el => (
                    el.id === _el.id ? { ..._el, quantity: quantity } : _el
                  )))
                },
                unitChange: ({ unit: _unit }: { unit: "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined }) => {
                  setNewIngredients(prev => prev.map(({ unit, ...rest }, _index) => (
                    el.id === rest.id ? { ...rest, unit: _unit } : rest
                  )))
                },
              }}
            />
            <Button
              className="bg-slate-950 text-white hover:bg-orange-300 hover:text-slate-950 aspect-square p-0"
              onClick={() => setNewIngredients(prev =>
                prev.filter(_el => _el.id !== el.id)
              )}
            >
              <IconSquareX className="size-5" />
            </Button>
          </div>
        )}
        {newIngredients.length ? (
          <Button
            onClick={handleCreate}
            className="bg-slate-950 text-white hover:bg-orange-300 hover:text-slate-950"
          >
            <IconDeviceFloppy className="mr-2 size-5" /> Save All
          </Button>
        ) : null
        }
      </div>
    </div>
  );
};