import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ArrowDown, SaveFill, Save } from "../../../assets/icons";
import { getRecipe, editRecipe } from "../../../api/recipe";
import { useState } from "react";


export default function Description() {

  const queryClient = useQueryClient();
  const { recipeId } = useParams();

  const { isPending, isError, data: recipe, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const { mutateAsync: editMutation } = useMutation({
    mutationFn: editRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe'])
    }
  });

  const [descriptionValue, changeHandler] = useState(recipe?.description ? recipe?.description : "")

  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="input"></label>
      <textarea
        name="description"
        id="input"
        value={descriptionValue}
        onChange={(e) => changeHandler(e.target.value)}
        className="flex-grow rounded-lg resize-y border p-2"
      />

      <div className="flex justify-center">
        <button
          type={`${!descriptionValue && 'button'}`}
        >
          {descriptionValue ? (
            <img src={SaveFill} alt="save-fill" onClick={async () => {
              await editMutation({
                data: {
                  description: descriptionValue
                }, 
                recipeId
              });
              changeHandler(descriptionValue);
            }}
            />
          ) : (
            <img src={Save} alt="save-empty" />
          )}
        </button>
      </div>
    </div>
  )
};