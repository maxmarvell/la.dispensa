import { useState } from "react";
import { useParams } from "react-router-dom";

// types
import { IngredientFieldProps } from "@/pages/recipe/models";
import { useIngredient } from "@/pages/recipe/hooks/useIngredient";

// components
import { IconDeviceFloppy, IconEdit, IconCircleMinus } from "@tabler/icons-react";
import { BaseIngredientType } from "@/types/ingredient";

const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];

const Field = ({ ingredient }: IngredientFieldProps) => {

  // extract composite keu
  const { ingredientId, recipeId, ...data } = ingredient;

  // extract the optional field
  const { unit, ...rest } = data;

  // extract rest
  const { quantity, ingredient: { name } } = rest;

  // check optional field exists and save state accordingly
  const [updatedIngredient, setUpdates] = useState<Omit<BaseIngredientType, "ingredientId">>(unit ? data : rest)


  const { removeIngredient, updateIngredient } = useIngredient({ recipeId })

  const RemoveButton = () => {
    let [_, setHovered] = useState(false);
    return (
      <button
        onClick={() => removeIngredient.mutateAsync({ ingredientId })}
        className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <IconCircleMinus />
      </button>
    )
  }

  // save the updates
  const handleUpdate = async () => {
    await updateIngredient.mutateAsync({
      ingredientId,
      input: updatedIngredient,
    })
    setEditing(false);
  };

  // Update button
  const UpdateButton = () => {
    let [_, setHovered] = useState(false);
    return (
      <button
        className="bg-slate-950 border-2 border-slate-950 mb-1 hover:bg-orange-300"
        onClick={handleUpdate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <IconDeviceFloppy />
      </button>
    )
  }

  // By default the ingredient is not editable
  const [editing, setEditing] = useState(false);

  // Button to handle toggle editing mode
  const EditButton = () => {
    const [_, setHovered] = useState(false);
    return (
      <button
        onClick={() => setEditing(!editing)}
        className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <IconEdit />
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

  // extract recipe id
  const { recipeId } = useParams();

  // fetch the ingredients
  const { getIngredients: { data } } = useIngredient({ recipeId });

  // map the components
  const ingredients = data?.ingredients;

  return (
    <div className="">
      {ingredients?.map((el, index) => (
        <Field ingredient={el} key={index} />
      ))}
    </div>
  );
};