import { useContext, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { remove as removeIngredient, update as updateIngredient } from "../../../api/ingredients"
import { getRecipe } from "../../../api/recipe"
import AuthContext from "../../../context/auth"
import * as dark from "../../../assets/icons/dark"

const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];


const UpdateField = ({ ingredient }) => {

  const { user: { id: userId } } = useContext(AuthContext);
  const { recipeId: id } = useParams();

  // Extract the current recipe to check permission
  const { data: recipe } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe({ recipeId: id })
  });

  // Extract Composite Key (ingredientId, recipeId) and name for code readability
  const { ingredientId, recipeId, ingredient: { name }, ...data } = ingredient;

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

  // Check the viewer is the author and the recipe is from the current route
  const canEdit = (id === recipeId && recipe?.authorId === userId);

  // Component for ingredients that can be edited
  if (canEdit) {
    return (
      <div className="flex justify-between items-center p-1 odd:bg-white even:bg-slate-100">
        {!editing ? (
          <div className="flex space-x-2">
            <span className="capitalize">{name}</span>
            <span>{ingredient.quantity} {ingredient.unit}</span>
          </div>
        ) : (
          <div className="flex space-x-2">
            <span
              className="border-0 p-0 border-b-2 bg-transparent border-black capitalize"
            >
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
        )
        }
        <div className="flex space-x-2 min-w-fit">
          {editing ? (
            <button
              onClick={handleSave}
              className={`border-2 ${false ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
            >
              <img src={dark.Save} alt="save-icon" />
            </button>
          ) : (
            <button
              onClick={() => removeMutation({ ingredientId, recipeId })}
              className={`border-2 ${false ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
            >
              <img src={dark.Remove} alt="remove-icon" />
            </button>
          )}
          <button
            onClick={() => setEditing(!editing)}
            className={`border-2 ${editing ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
          >
            <img src={dark.Edit} alt="edit-icon" />
          </button>
        </div>
      </div >
    )
  };

  // Component for ingredients that cannot be edited
  return (
    <div className="flex justify-between items-center p-1 odd:bg-white even:bg-slate-100">
      <div className="flex space-x-2">
        <span className="capitalize">{name}</span>
        <span className="lowercase">{ingredient.quantity} {ingredient.unit}</span>
      </div>
    </div >
  );
};

export default UpdateField;