import { useState, useEffect, useContext } from "react";
import { createManyIterationIngredients } from "../../../api/test-kitchen";
import { useMutation } from "@tanstack/react-query";

import * as light from '../../../assets/icons/light';
import * as dark from '../../../assets/icons/dark';

import { useParams } from "react-router-dom";
import AuthContext from "../../../context/auth";
import SocketContext from "../../../context/socket";

const CREATE_INGREDIENT_CHANNEL = import.meta.env.VITE_CREATE_INGREDIENT_CHANNEL;

const measureSelections = [
  { value: 'G', name: 'g' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];

const Field = ({ state, setNewIngredients }) => {
  return (
    <div className="flex space-x-3">
      <input
        className="w-20 bg-transparent border-0 border-b border-slate-950 focus:outline-none focus:border-orange-300"
        type='text'
        value={state.ingredient.name}
        onChange={(e) =>
          setNewIngredients(prev => {
            let newArr = [...prev];
            newArr[state.index] = { ...state, ingredient: { name: e.target.value } };
            return newArr;
          })
        }
        placeholder="ingredient"
      />
      <input
        className="w-20 bg-transparent border-0 border-b border-slate-950 focus:outline-none focus:border-orange-300"
        type="number"
        value={state.quantity}
        onChange={(e) =>
          setNewIngredients(prev => {
            let newArr = [...prev];
            newArr[state.index] = { ...state, quantity: e.target.value };
            return newArr;
          })
        }
        placeholder="quantity"
      />
      <select
        className="w-20 bg-transparent border-0 border-b border-slate-950 focus:outline-none focus:border-orange-300"
        type='text'
        value={state.unit || ""}
        onChange={(e) =>
          setNewIngredients(prev => {
            let newArr = [...prev];
            let { unit, ...rest } = state;
            newArr[state.index] = (e.target.value !== "") ? { ...rest, unit: e.target.value } : rest;
            return newArr;
          })
        }
      >
        <option value="">-</option>
        {measureSelections.map((el, index) => (<option key={index} value={el.value}>{el.name}</option>))}
      </select>
    </div>
  )
};

export const CreateIngredients = ({ iteration, setNodes }) => {

  const { id: iterationId } = iteration;
  const { recipeId } = useParams();
  const { user: { id: userId } } = useContext(AuthContext);

  const { socket } = useContext(SocketContext);

  // Allow users to be able to add ingredients
  // Use state for the new input fields
  const [newIngredients, setNewIngredients] = useState([]);
  const handleAddIngredient = () => {
    setNewIngredients((prev) => [...prev, {
      ingredient: {
        name: ""
      },
      quantity: "",
      index: newIngredients.length
    }]);
  };

  // Update the selected iterations ingredient field
  const { mutateAsync: createMutation } = useMutation({
    mutationFn: createManyIterationIngredients
  });

  const handleCreate = async () => {

    // Await the newly created ingredients
    let createdIngredients = await createMutation({
      input: newIngredients,
      iterationId,
    });

    // Reset the new ingredients form
    setNewIngredients([])

    // Update the global test-kitchen state
    setNodes((prev) => (prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        let { ingredients } = data;
        return { ...rest, data: { ...data, ingredients: [...ingredients, ...createdIngredients] } };
      } else {
        return { ...rest, data };
      }
    })));

    // emit the change
    socket?.emit(CREATE_INGREDIENT_CHANNEL, {
      newIngredients,
      iterationId,
      recipeId,
      userId,
    });
  };

  // Reset Form onClick away
  useEffect(() => {
    setNewIngredients([]);
  }, [iteration])

  return (
    <>
      <div className="flex justify-between items-center mt-5 mb-2">
        <div className="text-center">Add ingredients</div>
        <button
          className="h-5 w-5 ml-2 rounded-sm my-auto"
          onClick={handleAddIngredient}
        >
          <img src={dark.AddFill} alt="add ingredient" />
        </button>
      </div>
      <div className="space-y-4">
        {newIngredients.map(el =>
          <Field
            state={el}
            setNewIngredients={setNewIngredients}
            key={el.index}
          />
        )}
      </div>
      {newIngredients.length ? (
        <button
          onClick={handleCreate}
          className="px-2 py-1 mt-4 bg-slate-950 text-white hover:bg-orange-300 hover:text-slate-950"
        >
          Save All
        </button>
      ) : null
      }
    </>
  );
};