import { getIngredients } from "../../../api/ingredients";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { removeIngredient, updateIngredient } from "../../../api/ingredients";

// Components
import * as dark from "../../../assets/icons/dark";
import * as light from "../../../assets/icons/light";


const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];

const Field = ({ ingredient }) => {

  // Extract Composite Key (ingredientId, recipeId) and name for code readability
  const { ingredientId, recipeId, ...data } = ingredient;

  // Extract the optional field
  const { unit, ...rest } = data;

  // Check optional field exists and save state accordingly
  const [updatedIngredient, setUpdates] = useState(unit ? data : rest)

  // Query client to invalidate queries
  const queryClient = useQueryClient();

  // Update mutation invalidates get ingredients
  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateIngredient,
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries(['ingredients']);
    },
  });

  // Remove the ingredient from the list
  const { mutateAsync: removeMutation } = useMutation({
    mutationFn: removeIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries(['ingredients']);
    },
  })

  // Save the updates
  const handleSave = async () => {
    let result = await updateMutation({
      ingredientId, recipeId,
      data: updatedIngredient,
    })
    setEditing(false);
  }

  // By default the ingredient is not editable
  const [editing, setEditing] = useState(false);

  const [hovered, setHovered] = useState([false, false])

  const { quantity, ingredient: { name } } = rest;

  if (!editing) {
    return (
      <div className="flex justify-between items-center p-1 pl-2 odd:bg-white even:bg-slate-100">
        <div className="flex space-x-2">
          <span className="capitalize">{name}</span>
          <span>{ingredient.quantity} {ingredient.unit}</span>
        </div>
        <div className="flex space-x-2 min-w-fit">
          <button
            onClick={() => removeMutation({ ingredientId, recipeId })}
            className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
            onMouseEnter={() => setHovered(prev => [true, prev[1]])}
            onMouseLeave={() => setHovered(prev => [false, prev[1]])}
          >
            <img src={hovered[0] ? dark.Remove : light.Remove} className="h-5" alt="remove-icon" />
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
            onMouseEnter={() => setHovered(prev => [prev[0], true])}
            onMouseLeave={() => setHovered(prev => [prev[0], false])}
          >
            <img src={hovered[1] ? dark.Edit : light.Edit} className="h-5" alt="edit-icon" />
          </button>
        </div>
      </div>
    )
  };

  // Author view
  return (
    <div className="flex justify-between items-center p-1 pl-2 odd:bg-white even:bg-slate-100">
      <div className="flex space-x-2">
        <span className="border-0 p-0 border-b-2 bg-transparent border-black capitalize">
          {name}
        </span>
        <label className="" hidden>
        </label>
        <input
          className="border-0 p-0 border-b-2 bg-transparent border-black ring-offset-2
                         focus-within:ring-2 w-fit max-w-10"
          type="number"
          value={updatedIngredient.quantity}
          onChange={(e) => (setUpdates({ ...updatedIngredient, quantity: e.target.value }))}
        />
        <label className="" hidden>
        </label>
        <select
          className="border-0 p-0 max-w-fit border-b-2 bg-transparent border-black ring-offset-2 focus-within:ring-2"
          type='text'
          value={updatedIngredient.unit ? updatedIngredient.unit : ""}
          onChange={(e) => (setUpdates(({ unit, ...rest }) => (e.target.value ? { ...rest, unit: e.target.value } : rest)))}
        >
          <option value="">-</option>
          {measureSelections.map((el, index) => (
            <option key={index} value={el.value}>{el.name}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2 min-w-fit">
        <button
          onClick={handleSave}
          className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
          onMouseEnter={() => setHovered(prev => [true, prev[1]])}
          onMouseLeave={() => setHovered(prev => [false, prev[1]])}
        >
          <img src={hovered[0] ? dark.Save : light.Save} className="h-5" alt="save-icon" />
        </button>
        <button
          onClick={() => setEditing(!editing)}
          className="border-2 border-orange-300 bg-orange-300"
          onMouseEnter={() => setHovered(prev => [prev[0], true])}
          onMouseLeave={() => setHovered(prev => [prev[0], false])}
        >
          <img src={dark.Edit} className="h-5" alt="edit-icon" />
        </button>
      </div>
    </div >
  )
};

export const UpdateIngredients = () => {

  // Extract recipe id
  const { recipeId } = useParams();

  // Fetch the ingredients
  const { data, isLoading, isError } = useQuery({
    queryKey: ['ingredients', recipeId],
    queryFn: () => getIngredients({ recipeId })
  });

  // Map the components
  const ingredients = data?.ingredients;

  return (
    <div className="">
      {ingredients?.map((el, index) => (
        <Field ingredient={el} key={index} />
      ))}
    </div>
  );
};