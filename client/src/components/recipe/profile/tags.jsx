import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getRecipe, updateTags } from "../../../api/recipe";
import * as light from '../../../assets/icons/light'
import { useState } from "react";

const maxTags = 3;

const Tags = ({ editing }) => {

  const { recipeId } = useParams();

  const { isLoading, isError, data: recipe, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: updateTags,
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', recipeId])
    }
  })

  const [creatingNewTag, setCreating] = useState(false);
  const [newTag, setNewTag] = useState("");

  const tags = recipe?.tags;

  const handleAddNewTag = async () => {
    let newTags = tags.map(({ name }) => ({ name }))
    newTags.push({ name: newTag })
    let result = await mutateAsync({
      recipeId, input: newTags
    })
    if (result) {
      setNewTag("");
      if (newTags.length === 3) {
        setCreating(false);
      }
    };
  };

  const handleRemoveTag = async ({ name }) => {
    var newTags = tags.map(({ name }) => ({ name }));
    newTags = newTags.filter(el => el.name !== name)
    let result = await mutateAsync({
      recipeId, input: newTags
    });
  }


  if (editing) {
    return (
      <>
        <div className="flex space-x-3 text-xs ">
          {tags?.map(({ name }, index) =>
            <div
              className="bg-slate-950 flex text-white px-2 capitalize py-1 
                     relative"
              key={index}
            >
              {name}
              <button
                className="h-4 w-4 absolute -top-2 -right-2 bg-slate-950 rounded-full"
                onClick={() => handleRemoveTag({ name })}
              >
                <img src={light.RemoveFill} alt="remove tag" />
              </button>
            </div>
          )}
          {(tags.length < maxTags) ? (
            <button
              className="border border-slate-950 px-2 py-1 border-dashed"
              onClick={() => setCreating(true)}
            >
              new tag
            </button>
          ) : null}
        </div>
        {creatingNewTag ? (
          <div className="fixed flex inset-0 left-44 bg-slate-950/20 z-40 overscroll-contain justify-center">
            <div className="flex flex-col justify-center">
              <div className="flex flex-col border p-2 bg-slate-50 text-xs">
                <div className="flex justify-between items-center pb-2 min-w-60">
                  <div className="underline">Add a New Tag</div>
                  <button
                    className=""
                    onClick={() => setCreating(false)}
                  >
                    <img className="size-5" src={light.CloseRing} alt="" />
                  </button>
                </div>
                <div className="border-b-2 border-transparent focus-within:border-orange-300 flex justify-between items-center">
                  <input
                    type="text"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Tag"
                    className="border-none focus:outline-none bg-transparent grow"
                  />
                  {newTag.length ? (
                    <button
                      className="w-fit"
                      onClick={handleAddNewTag}
                    >
                      <img className="size-5" src={light.Add} alt="" />
                    </button>

                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    )
  }

  return (
    <div className="flex space-x-3 text-xs">
      {tags?.map(({ name }, index) =>
        <div
          className="bg-slate-950 flex text-white px-2 capitalize py-1 
                     hover:bg-orange-300 hover:text-slate-950 cursor-pointer"
          key={index}
        >
          {name}
        </div>
      )}
    </div>
  )
}

export default Tags;