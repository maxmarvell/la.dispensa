import { useState, useEffect, useContext } from "react";
import { deleteIterationIngredient, updateIterationIngredient } from "../../../api/test-kitchen";
import { useMutation } from "@tanstack/react-query";
import SocketContext from "../../../context/socket";
import { useParams } from "react-router-dom";
import AuthContext from "../../../context/auth";

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

const Field = ({ data, setNodes, setCurrentIngredients, setSelectOptions }) => {

  // Spread optional field from non-optional fields
  const { unit, ...rest } = data

  // Unpack useful constant variables
  const { iterationId, ingredientId } = rest;

  // Initialise state for input change
  const [ingredient, setIngredient] = useState(unit ? data : rest);

  // retrieve the active socket
  const { socket } = useContext(SocketContext);

  const { recipeId } = useParams();

  const { user: { id: userId } } = useContext(AuthContext);

  // Delete the selected iterations ingredient field
  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: deleteIterationIngredient
  });

  // Update the selected iterations ingredient field
  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateIterationIngredient
  });


  const handleUpdate = async () => {

    // Wait to update the ingredient
    let updatedIngredient = await updateMutation({ ingredientId, iterationId, input: ingredient });

    // Update the global test-kitchen state
    setNodes((prev) => (prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        let { ingredients } = data;
        return { ...rest, data: { ...data, ingredients: ingredients.map(el => el.ingredientId === ingredientId ? ingredient : el) } };
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
    await deleteMutation({ ingredientId, iterationId });

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
          onChange={(e) => setIngredient(prev => ({ ...prev, quantity: e.target.value }))}
        />
        <select
          className="w-10 bg-transparent border-0 border-b border-slate-950 focus:border-orange-300 focus:outline-none"
          value={ingredient.unit || ""}
          onChange={(e) => setIngredient(({ unit, ...rest }) => {
            return e.target.value ? { ...rest, unit: e.target.value } : { ...rest }
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

export const ModifyIngredients = ({ iteration, setNodes }) => {

  // Create a state to store the select options
  const [selectOptions, setSelectOptions] = useState(iteration.ingredients);

  // Set the selected option
  const [currentIngredients, setCurrentIngredients] = useState([])
  const handleOptionSelect = (e) => {

    // Remove selection choice and find the corresponding clicked element data
    setSelectOptions((arr) => (arr.filter(el => el.ingredientId !== e.target.value)));

    // Retrieve the ingredient from the iteration ingredients
    let ingredient = selectOptions.find(el => el.ingredientId === e.target.value);

    // Add the ingredient
    setCurrentIngredients((prev) => [...prev, ingredient])
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