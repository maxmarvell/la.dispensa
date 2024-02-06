import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { get as getIngredients, create as createIngredients, remove as removeIngredient, update as updateIngredient } from "../../api/ingredients"
import { getComponents, getRecipe } from "../../api/recipe"
import AuthContext from "../../context/auth"
import * as dark from "../../assets/icons/dark"

const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
]


const IngredientField = ({ ingredient }) => {

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
  const canEdit = id === recipeId && recipe?.authorId === userId;


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
  }

  // Component for ingredients that cannot be edited
  return (
    <div className="flex justify-between items-center p-1 odd:bg-white even:bg-slate-100">
      <div className="flex space-x-2">
        <span className="capitalize">{name}</span>
        <span className="lowercase">{ingredient.quantity} {ingredient.unit}</span>
      </div>
    </div >
  )
}


const NewIngredientField = ({ state, handler, index }) => {

  const handleSetName = (e) => {
    handler(((prev) => {
      let newArr = [...prev];
      newArr[index] = { ...state, ingredient: { name: e.target.value } };
      return newArr;
    }))
  }

  const handleSetUnit = (e) => {
    handler(((prev) => {
      let newArr = [...prev]
      let { unit, ...rest } = newArr[index]
      newArr[index] = e.target.value ? { ...rest, unit: e.target.value } : rest
      return newArr
    }))
  }

  const handleSetQuantity = (e) => {
    handler(((prev) => {
      let newArr = [...prev]
      newArr[index] = { ...state, quantity: e.target.value }
      return newArr
    }))
  }

  return (
    <div className="flex space-x-2 w-2/3 min-w-64">
      <label className="flex grow">
        <input
          className="border-0 p-0 border-b-2 bg-transparent border-slate-950
                     focus:outline-none focus:border-orange-300 capitalize grow"
          type='text'
          value={state.ingredient.name}
          onChange={handleSetName}
          placeholder="Product"
        />
      </label>
      <label>
        <input
          className="border-0 p-0 border-b-2 bg-transparent border-slate-950
                     focus:outline-none focus:border-orange-300 max-w-12"
          type="number"
          value={state.quantity}
          onChange={handleSetQuantity}
          placeholder="100"
        />
      </label>
      <label className="flex justify-end">
        <select
          className="border-0 p-0 border-b-2 bg-transparent border-slate-950
                     focus:outline-none focus:border-orange-300 max-w-12"
          type='text'
          value={state.unit ? state.unit : ""}
          onChange={handleSetUnit}
        >
          <option value="">-</option>
          {measureSelections.map((el, index) => (
            <option key={index} value={el.value}>{el.name}</option>
          ))}
        </select>
      </label>
    </div>
  )
}


export default function Ingredients() {

  const { recipeId } = useParams();

  // Extract the current recipe to check permission
  const { data: recipe } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const { isPending, isError, data: ingredients, error } = useQuery({
    queryKey: ['ingredients', recipeId],
    queryFn: () => getIngredients({ recipeId })
  });


  const { data: components } = useQuery({
    queryKey: ['components', recipeId],
    queryFn: getComponents({ recipeId })
  })

  // Query client to invalidate get Ingredients query
  const queryClient = useQueryClient();

  // Add mutation invalidates get instructions
  const { mutateAsync: addMutation } = useMutation({
    mutationFn: createIngredients,
    onSuccess: () => {
      setNewIngredients([]);
      queryClient.invalidateQueries(['instructions']);
    },
  });

  // Use state for the new input fields
  const [newIngredients, setNewIngredients] = useState([]);
  const handleAddIngredient = () => {
    setNewIngredients((prev) => [...prev, {
      ingredient: {
        name: ""
      },
      quantity: "",
      recipeId
    }]);
  };

  // If no ingredients have been added already default to one empty field
  useEffect(() => {
    ingredients?.length === 0 ? setNewIngredients([{
      ingredient: {
        name: ""
      },
      quantity: "",
      recipeId
    }]) : setNewIngredients([]);
  }, [ingredients]);

  if (components?.length) {
    return (
      <div className="divide-y text-sm">
        <div className="pb-3">
          <div className="pb-1 text-base">For the {recipe?.title}</div>
          {ingredients?.map((el, index) => (
            <IngredientField
              ingredient={el}
              key={index} />
          ))}

          {components.map((el) => {
            let { amount, component: { title, ingredients } } = el;
            let scaled = ingredients.map(({ quantity, ...rest }) => (
              { quantity: quantity * amount, ...rest }
            ))
            return (
              <>
                <div className="pb-1 pt-5 last:pb-0 text-base">For the {title}</div>
                {scaled?.map((el, index) => (
                  <IngredientField
                    ingredient={el}
                    key={index} />
                ))}
              </>
            )
          })}
        </div>
        <div className="space-y-4 pt-3">
          {newIngredients?.map((ingredient, index) => (
            <NewIngredientField state={ingredient} handler={setNewIngredients} key={index} index={index} />
          ))}
          <div className="flex justify-center space-x-5">
            <button
              onClick={handleAddIngredient}
              className={`border-2 ${false ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
            >
              <img src={dark.Add} alt="add-icon" />
            </button>
            <button
              onClick={() => {
                addMutation({ data: newIngredients })
              }}
              className={`border-2 ${false ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
            >
              <img src={dark.Save} alt="save-icon" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y text-sm">
      <div className="pb-3">
        {ingredients?.map((el, index) => (
          <IngredientField
            ingredient={el}
            key={index} />
        ))}

      </div>
      <div className="space-y-4 pt-3">
        {newIngredients?.map((ingredient, index) => (
          <NewIngredientField state={ingredient} handler={setNewIngredients} key={index} index={index} />
        ))}
        <div className="flex justify-center space-x-5">
          <button
            onClick={handleAddIngredient}
            className={`border-2 ${false ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
          >
            <img src={dark.Add} alt="add-icon" />
          </button>
          <button
            onClick={() => {
              addMutation({ data: newIngredients })
            }}
            className={`border-2 ${false ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
          >
            <img src={dark.Save} alt="save-icon" />
          </button>
        </div>
      </div>
    </div>
  )
}