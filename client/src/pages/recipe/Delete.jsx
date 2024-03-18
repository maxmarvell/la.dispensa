import { useQuery, useMutation } from "@tanstack/react-query";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { getRecipe } from "../../api/recipe";
import { useState } from "react";
import { deleteRecipe } from "../../api/recipe";

const Delete = ({ }) => {

  const { recipeId } = useParams();

  const navigate = useNavigate();

  const { data: recipe } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const [input, setInput] = useState("");

  const active = input === recipe?.title;

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: deleteRecipe
  });

  const handleDelete = async () => {
    let result = await deleteMutation({ recipeId })
    if (result) {
      return navigate("/recipes")
    }
  }

  return (
    <>
      <div className="w-3/5 min-w-72 text-center mx-auto py-3">
        Confirm you want to delete the recipe by writing <span className="font-bold"> {recipe?.title} </span>
        in the input below
      </div>
      <div className="flex justify-center py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border-0 p-0 border-b-2 border-slate-950 focus:outline-0 
                   focus:border-orange-300 mx-auto text-center"
          placeholder={recipe?.title}
        />
      </div>
      <div className="flex justify-center pt-3">
        <button
          className={`bg-slate-950 text-white py-1 px-2 ${active ? "bg-red-500" : ""}`}
          onClick={handleDelete}
          disabled={!active}
        >
          Delete
        </button>
      </div>
    </>
  )
};

export default Delete;