import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// APIs
import { getIngredients, createIngredients } from "../../../api/ingredients";

// Components
import * as dark from "../../../assets/icons/dark";
import * as light from "../../../assets/icons/light";
import LoadingSpinner from "../../styled-components/loadingSpinner";

// types
import { createIngredientPropsType, NewIngredientType } from "../../../@types/ingredients";

const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];


const CreateField = ({ newIngredient, setNewIngredient }: createIngredientPropsType) => {

  // Extract the index
  const index = newIngredient?.index;

  // Input change for name field
  const handleSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewIngredient(prev => {
      let newArr = [...prev];
      newArr[index] = { ...newIngredient, ingredient: { name: e.target.value } };
      return newArr;
    });
  };

  // Input change for unit field
  const handleSetUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewIngredient(prev => {
      let newArr = [...prev]
      let { unit, ...rest } = newArr[index]
      newArr[index] = e.target.value ? { ...rest, unit: e.target.value } : rest
      return newArr
    });
  };

  // Input change for quantity field
  const handleSetQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewIngredient(prev => {
      let newArr = [...prev];
      newArr[index] = { ...newIngredient, quantity: e.target.value };
      return newArr;
    });
  };

  const removeField = () => {
    setNewIngredient(prev => {
      let newArr = [...prev];
      return newArr.filter(el => el.index !== index).map(({ index: i, ...rest }) => (
        i > index ? ({ ...rest, index: i - 1 }) : ({ ...rest, index: i })
      ));
    });
  };

  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex space-x-5 justify-between pl-2 py-1 odd:bg-white even:bg-slate-100 last:mb-2">
      <div className="flex space-x-2 grow">
        <label className="flex grow">
          <input
            className="border-0 p-0 border-b-2 bg-transparent border-slate-950 h-6
                     focus:outline-none focus:border-orange-300 capitalize grow"
            type='text'
            value={newIngredient.ingredient.name}
            onChange={handleSetName}
            placeholder="Product"
          />
        </label>
        <label>
          <input
            className="border-0 p-0 border-b-2 bg-transparent border-slate-950 h-6
                     focus:outline-none focus:border-orange-300 max-w-12 "
            type="number"
            value={newIngredient.quantity}
            onChange={handleSetQuantity}
            placeholder="100"
          />
        </label>
        <label className="flex justify-end">
          <select
            className="border-0 p-0 border-b-2 bg-transparent border-slate-950 h-6
                     focus:outline-none focus:border-orange-300 max-w-12"
            value={newIngredient.unit ? newIngredient.unit : ""}
            onChange={handleSetUnit}
          >
            <option value="">-</option>
            {measureSelections.map((el, index) => (
              <option key={index} value={el.value}>{el.name}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        onClick={removeField}
        className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img className="h-5" src={hovered ? dark.Remove : light.Remove} alt="remove-icon" />
      </button>
    </div>
  )
}

export const CreateIngredients = () => {

  const { recipeId } = useParams();

  // Fetch ingredients to check if none provided
  const { data } = useQuery({
    queryKey: ['ingredients', recipeId],
    queryFn: () => getIngredients({ recipeId })
  });
  const ingredients = data?.ingredients;

  // Use state for the new input fields
  const [newIngredients, setNewIngredients] = useState<NewIngredientType[]>([]);
  const handleAddIngredient = () => {
    setNewIngredients(prev => [...prev, {
      ingredient: {
        name: ""
      },
      quantity: "",
      index: newIngredients.length,
      recipeId,
    }]);
  };

  // If no ingredients have been added already default to one empty field
  useEffect(() => {
    ingredients?.length === 0 ? setNewIngredients([{
      ingredient: {
        name: ""
      },
      quantity: "",
      recipeId,
      index: 0
    }]) : setNewIngredients([]);
  }, [ingredients]);

  // Query client to invalidate get Ingredients query
  const queryClient = useQueryClient();

  // Add mutation invalidates get instructions
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIngredients,
    onSuccess: () => {
      setNewIngredients([]);
      queryClient.invalidateQueries({ queryKey: ['instructions'] });
    },
  });

  const handleCreate = () => {
    mutateAsync({ data: newIngredients });
  };

  return (
    <div className="py-2 pr-1">
      <div>
        {newIngredients?.map((ingredient, index) => (
          <CreateField newIngredient={ingredient} setNewIngredient={setNewIngredients} key={index} />
        ))}
      </div>
      <div className="flex justify-center space-x-5">
        <button
          onClick={handleAddIngredient}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <img src={dark.Add} alt="add-icon" />
        </button>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          <button
            onClick={handleCreate}
            className="border-2 hover:border-orange-300 hover:bg-orange-300  border-slate-950"
          >
            <img src={dark.SaveFill} alt="save-icon" />
          </button>
        )}
      </div>
    </div>
  );
};