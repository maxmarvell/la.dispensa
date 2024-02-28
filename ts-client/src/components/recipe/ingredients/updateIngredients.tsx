import { getIngredients } from "../../../api/ingredients";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { removeIngredient, updateIngredient } from "../../../api/ingredients";

// Components
import * as dark from "../../../assets/icons/dark";
import * as light from "../../../assets/icons/light";
import { BaseIngredient } from "../../../@types/ingredients";
import { IngredientType } from "../../../@types/recipe";


const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];

const Field = ({ ingredient }: { ingredient: IngredientType }) => {

  // Extract Composite Key (ingredientId, recipeId) and name for code readability
  const { ingredientId, recipeId, ...data } = ingredient;

  // Extract the optional field
  const { unit, ...rest } = data;

  // Extract rest of fields
  const { quantity, ingredient: { name } } = rest;

  // Check optional field exists and save state accordingly
  const [updatedIngredient, setUpdates] = useState<BaseIngredient>(unit ? data : rest)

  // Query client to invalidate queries
  const queryClient = useQueryClient();

  // Update mutation invalidates get ingredients
  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateIngredient,
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  // Remove the ingredient from the list
  const { mutateAsync: removeMutation } = useMutation({
    mutationFn: removeIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  })

  const RemoveButton = () => {
    let [hovered, setHovered] = useState(false);
    return (
      <button
        onClick={() => removeMutation({ ingredientId, recipeId })}
        className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img src={hovered ? dark.Remove : light.Remove} className="h-5" alt="remove-icon" />
      </button>
    )
  }

  // Save the updates
  const handleUpdate = async () => {
    await updateMutation({
      ingredientId, recipeId,
      data: updatedIngredient,
    })
    setEditing(false);
  };

  // Update button
  const UpdateButton = () => {
    let [hovered, setHovered] = useState(false);
    return (
      <button
        className="bg-slate-950 border-2 border-slate-950 mb-1 hover:bg-orange-300"
        onClick={handleUpdate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img src={hovered ? dark.Save : light.Save} className="w-5" alt="remove-icon" />
      </button>
    )
  }

  // By default the ingredient is not editable
  const [editing, setEditing] = useState(false);

  // Button to handle toggle editing mode
  const EditButton = () => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        onClick={() => setEditing(!editing)}
        className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img src={hovered ? dark.Edit : light.Edit} className="h-5" alt="edit-icon" />
      </button>
    );
  };

  if (!editing) {
    return (
      <div className="flex justify-between items-center p-1 pl-2 odd:bg-white even:bg-slate-100">
        <div className="flex space-x-2">
          <span className="capitalize">{name}</span>
          <span>{quantity} {unit}</span>
        </div>
        <div className="flex space-x-2 min-w-fit">
          <RemoveButton />
          <EditButton />
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
          onChange={(e) => (setUpdates({ ...updatedIngredient, quantity: parseInt(e.target.value) }))}
        />
        <label className="" hidden>
        </label>
        <select
          className="border-0 p-0 max-w-fit border-b-2 bg-transparent border-black ring-offset-2 focus-within:ring-2"
          value={updatedIngredient.unit ? updatedIngredient.unit : ""}
          onChange={(e) => (setUpdates(({ unit, ...rest }) => (e.target.value ? { ...rest, unit: e.target.value as "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined } : rest)))}
        >
          <option value="">-</option>
          {measureSelections.map((el, index) => (
            <option key={index} value={el.value}>{el.name}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2 min-w-fit">
        <UpdateButton />
        <EditButton />
      </div>
    </div >
  )
};

export const UpdateIngredients = () => {

  // Extract recipe id
  const { recipeId } = useParams();

  // Fetch the ingredients
  const { data } = useQuery({
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