import { useState, useContext } from "react";
import { useParams } from "react-router-dom";

// services
import AuthContext from "@/services/contexts/authContext";
import SocketContext from "@/services/contexts/socketContext";

// components
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { IngredientInput } from "@/components/ingredients/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";

// types
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { IterationProps } from "@/pages/test-kitchen/models";
import { useIterationIngredient } from "@/pages/test-kitchen/hooks/useIterationIngredients";
import { IterationIngredientType } from "@/types/iteration";

// redis channels
const DELETE_INGREDIENT_CHANNEL = import.meta.env.VITE_DELETE_INGREDIENT_CHANNEL;
const UPDATE_INGREDIENT_CHANNEL = import.meta.env.VITE_UPDATE_INGREDIENT_CHANNEL;

/*
  form for modifying a selected ingredient
*/

export const ModifyIngredients = ({ iteration, setNodes }: IterationProps) => {

  const [isSelected, setSelected] = useState("")

  // set the selected option
  const [ingredient, setIngredient] = useState<IterationIngredientType>({} as IterationIngredientType)
  const handleOptionSelect = (e: string) => {

    // retrieve the ingredient from the iteration ingredients
    let ingredient = iteration.ingredients.find(el => el.ingredientId === e);

    // add the ingredient
    if (ingredient) {
      setIngredient(ingredient)
      setSelected(ingredient.ingredientId)
    };
  }

  const { socket } = useContext(SocketContext) as SocketContextType;

  const { recipeId } = useParams();

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const { iterationId, ingredientId } = ingredient;

  const { removeIngredient, updateIngredient } = useIterationIngredient({ iterationId: iteration.id })


  const handleUpdate = async () => {

    // Wait to update the ingredient
    let updatedIngredient = await updateIngredient({ ingredientId, input: ingredient });

    // Update the global test-kitchen state
    setNodes(prev => (prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        let { ingredients } = data;
        return { ...rest, data: { ...data, ingredients: ingredients.map(el => el.ingredientId === ingredientId ? { ...ingredient, iterationId } : el) } };
      } else {
        return { ...rest, data };
      }
    })));

    socket?.emit(UPDATE_INGREDIENT_CHANNEL, {
      updatedIngredient,
      iterationId,
      userId,
      recipeId,
    });
  };

  const handleDelete = async () => {

    // Wait to update the ingredient
    await removeIngredient({ ingredientId });

    // Update the global test-kitchen state
    setNodes((prev) => (prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        let { ingredients } = data
        return { ...rest, data: { ...data, ingredients: ingredients.filter(el => el.ingredientId !== ingredientId) } };
      } else {
        return { ...rest, data };
      }
    })));

    // emit the corresponding change
    socket?.emit(DELETE_INGREDIENT_CHANNEL, {
      ingredientId,
      iterationId,
      userId,
      recipeId,
    });
  }

  return (
    <div className="space-y-1.5 mb-3">
      <Label htmlFor="ingredient-select">Select an ingredient to Modify</Label>
      <Select
        onValueChange={e => handleOptionSelect(e)}
        value={isSelected}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select an Ingredient" />
        </SelectTrigger>
        <SelectContent>
          {iteration.ingredients.map(el => (
            <SelectItem value={el.ingredientId} key={el.ingredientId} className="capitalize">{el.ingredient.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {
        isSelected ? (
          <>
            <div className="flex space-x-1">
              <IngredientInput
                key={ingredient.ingredientId}
                ingredient={ingredient}
                setIngredient={{
                  quantityChange: ({ quantity }: { quantity: number }) => { setIngredient(prev => ({ ...prev, quantity: quantity })) },
                  unitChange: ({ unit: newUnit }: { unit: "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined }) => {
                    setIngredient(({ unit, ...rest }) => {
                      return newUnit ? { ...rest, unit: newUnit } : { ...rest }
                    })
                  },
                }}
                disabled={true}
              />
            </div>
            <div className="flex space-x-1">
              <Button
                onClick={handleUpdate}
              >
                Save
              </Button>
              <Button
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button onClick={() => setSelected("")}>
                Cancel
              </Button>
            </div>
          </>
        ) : null
      }
    </div>
  );
};