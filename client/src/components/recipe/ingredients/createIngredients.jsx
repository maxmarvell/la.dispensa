import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { get as getIngredients, createIngredients } from "../../../api/ingredients";
import * as dark from "../../../assets/icons/dark";
import CreateField from "./createField";
import LoadingSpinner from "../../styled-components/loadingSpinner";


const NewIngredients = () => {

  const { recipeId } = useParams();

  const { data: ingredients } = useQuery({
    queryKey: ['ingredients', recipeId],
    queryFn: () => getIngredients({ recipeId })
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


  // Query client to invalidate get Ingredients query
  const queryClient = useQueryClient();

  // Add mutation invalidates get instructions
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIngredients,
    onSuccess: () => {
      setNewIngredients([]);
      queryClient.invalidateQueries(['instructions']);
    },
  });

  const handleCreate = () => {
    mutateAsync({ data: newIngredients });
  };

  return (
    <div className="space-y-4 pt-3">
      {newIngredients?.map((ingredient, index) => (
        <CreateField state={ingredient} handler={setNewIngredients} key={index} index={index} />
      ))}
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


export default NewIngredients;