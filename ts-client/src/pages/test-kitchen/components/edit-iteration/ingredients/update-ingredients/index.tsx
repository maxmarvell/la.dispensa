import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

// services
import AuthContext from "@/services/contexts/authContext";
import SocketContext from "@/services/contexts/socketContext";

// types
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { IterationIngredientFieldProps, IterationProps } from "@/pages/test-kitchen/models";
import { BaseIngredientType } from "@/types/ingredient";
import { useIterationIngredient } from "@/pages/test-kitchen/hooks/useIterationIngredients";
import { IterationIngredientType } from "@/types/iteration";

// redis channels
const DELETE_INGREDIENT_CHANNEL = import.meta.env.VITE_DELETE_INGREDIENT_CHANNEL;
const UPDATE_INGREDIENT_CHANNEL = import.meta.env.VITE_UPDATE_INGREDIENT_CHANNEL;

const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];

const Field = ({ data, setNodes, setCurrentIngredients, setSelectOptions }: IterationIngredientFieldProps) => {

  // Spread optional field from non-optional fields
  const { unit, ...rest } = data

  // Unpack useful constant variables
  const { iterationId, ingredientId } = rest;

  // Initialise state for input change
  const [ingredient, setIngredient] = useState<BaseIngredientType>(unit ? data : rest);

  // retrieve the active socket
  const { socket } = useContext(SocketContext) as SocketContextType;

  const { recipeId } = useParams();

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;


  const { removeIngredient, updateIngredient } = useIterationIngredient({ iterationId })


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

    // Remove the modification form
    setCurrentIngredients(prev => prev.filter(el => el.ingredientId !== ingredientId));

    // Re-add the option
    setSelectOptions(prev => [...prev, updatedIngredient]);

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

    // Remove the modification form
    setCurrentIngredients(prev => prev.filter(el => el.ingredientId !== ingredientId));

    // emit the corresponding change
    socket?.emit(DELETE_INGREDIENT_CHANNEL, {
      ingredientId,
      iterationId,
      userId,
      recipeId,
    });
  }


  const handleCancel = () => {

    // Remove the current form 
    setCurrentIngredients(prev => prev.filter(el => el.ingredientId !== ingredientId));

    // Re-add the option
    setSelectOptions(prev => [...prev, data]);
  }

  return (
    <div className="text-xs lg:flex lg:justify-between py-3 space-x-3 first:pt-0 last:pb-0">
      <div className="flex space-x-1">
        <div className="border-b border-slate-950 line-clamp-1 grow leading-loose capitalize">
          {ingredient.ingredient.name}
        </div>
        <input
          type="number"
          value={ingredient.quantity}
          className="w-10 bg-transparent border-0 border-b border-slate-950 focus:border-orange-300 focus:outline-none"
          onChange={(e) => setIngredient(prev => ({ ...prev, quantity: e.target.valueAsNumber }))}
        />
        <select
          className="w-10 bg-transparent border-0 border-b border-slate-950 focus:border-orange-300 focus:outline-none"
          value={ingredient.unit || ""}
          onChange={e => setIngredient(({ unit, ...rest }) => {
            return e.target.value ? { ...rest, unit: e.target.value as "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined } : { ...rest }
          })}
        >
          <option value="">-</option>
          {measureSelections.map((el, index) => (<option key={index} value={el.value}>{el.name}</option>))}
        </select>
      </div>
      <div className="flex space-x-1">
        <button
          className="bg-slate-950 text-white px-2 py-1"
          onClick={handleUpdate}
        >
          Save
        </button>
        <button
          className="bg-slate-950 text-white px-2 py-1"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="bg-slate-950 text-white px-2 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  )
};

export const ModifyIngredients = ({ iteration, setNodes }: IterationProps) => {

  // Create a state to store the select options
  const [selectOptions, setSelectOptions] = useState<IterationIngredientType[]>(iteration.ingredients);

  // Set the selected option
  const [currentIngredients, setCurrentIngredients] = useState<IterationIngredientType[]>([])
  const handleOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

    // Remove selection choice and find the corresponding clicked element data
    setSelectOptions(arr => arr.filter(el => el.ingredientId !== e.target.value));

    // Retrieve the ingredient from the iteration ingredients
    let ingredient = selectOptions.find(el => el.ingredientId === e.target.value);

    // Add the ingredient
    setCurrentIngredients(prev => ingredient ? [...prev, ingredient] : prev)
  }

  // Reset Form onClick away
  useEffect(() => {
    setSelectOptions(iteration.ingredients);
    setCurrentIngredients([]);
  }, [iteration])

  return (
    <>
      <label htmlFor="ingredient-select">Modify Ingredients</label>
      <select
        className="border-0 border-b border-slate-950 py-1 bg-transparent focus:outline-none focus:border-orange-300"
        value={""}
        onChange={(e) => handleOptionSelect(e)}
        id="ingredient-select"
      >
        <option value="">-</option>
        {selectOptions.map((el, index) => (
          <option key={index} value={el.ingredientId} className="capitalize">{el.ingredient.name}</option>
        ))}
      </select>
      {
        currentIngredients.length ? (
          <div className="divide-y pt-5 divide-slate-950">
            {
              currentIngredients.map((el, index) =>
                <Field
                  data={el}
                  setNodes={setNodes}
                  setCurrentIngredients={setCurrentIngredients}
                  setSelectOptions={setSelectOptions}
                  key={index}
                />
              )
            }
          </div>
        ) : null
      }
    </>
  );
};