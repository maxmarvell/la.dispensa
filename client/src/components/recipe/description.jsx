import { useQuery } from "@tanstack/react-query";
import { getRecipe } from "../../api/recipe";
import { useParams } from "react-router-dom";
import * as dark from "../../assets/icons/dark"
import { useRef, useState } from "react";
import { Save, SaveFill } from "../../assets/icons";
import { editRecipe } from "../../api/recipe";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";


const Description = () => {

  const { recipeId } = useParams();

  const { isLoading, isError, data: recipe, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const [description, setDescription] = useState(recipe?.description)

  const [editing, setEditing] = useState(false);

  const ref = useRef(null);

  const handleClickEdit = () => {
    setEditing(!editing);
    window.setTimeout(() => ref.current.focus(), 0);
  };

  const queryClient = useQueryClient();

  const { mutateAsync: editMutation } = useMutation({
    mutationFn: editRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe'])
    }
  });

  const handleEdit = async () => {
    let result = await editMutation({
      data: {
        description
      },
      recipeId
    });

    if (result) {
      setEditing(false)
    };
  }

  return (
    <div className="min-h-24 text-sm flex justify-between relative">
      <div hidden={editing} >
        {recipe?.description || "No Description Given, please add one"}
      </div>
      <label htmlFor="update-description-input" value="Update description text area" hidden />
      <textarea
        ref={ref}
        id="update-description-input"
        value={description || ""}
        onChange={(e) => setDescription(e.target.value)}
        className="grow min-h-24 border-0 resize-y focus:outline-0
                   focus:border-orange-300 focus:border-l-4 p-0 pl-1"
        placeholder="Description should be written here"
        hidden={!editing}
      />
      <div className="flex flex-col min-w-fit space-y-3 pl-3">
        <button
          className={`border-2 ${editing ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
          onClick={handleClickEdit}
        >
          <img src={dark.Edit} alt="" />
        </button>
        {editing ? (
          <button
            onClick={handleEdit}
          >
            <img
              src={SaveFill} alt="save-fill"
              className={`border-2 ${(description !== recipe?.description) ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
            />
          </button>
        ) : (
          null
        )}
      </div>
    </div>
  )
}


export default Description