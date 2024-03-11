import { useParams } from "react-router-dom";
import { useState } from "react";

// services
import { useRecipe } from "@/services/hooks/recipe/useRecipe";
import { useUpdateTags } from "@/pages/recipe/hooks/useUpdateTags";

import { IconCategoryPlus, IconCategoryMinus, IconX } from "@tabler/icons-react";


const maxTags = 3;

export const Tags = ({ editing }: { editing: boolean }) => {

  const { recipeId } = useParams();

  // fetch recipe
  const { getRecipeById } = useRecipe();
  const { data: recipe } = getRecipeById({ recipeId });

  const { mutateAsync } = useUpdateTags({ recipeId })

  const [creatingNewTag, setCreating] = useState(false);
  const [newTag, setNewTag] = useState("");

  const tags = recipe?.tags;

  const handleAddNewTag = async () => {
    let newTags = tags?.map(({ name }) => ({ name }))
    newTags?.push({ name: newTag })
    let result = await mutateAsync({
      tags: newTags
    })
    if (result) {
      setNewTag("");
      if (newTags?.length === 3) {
        setCreating(false);
      }
    };
  };

  const handleRemoveTag = async ({ name }: { name: string }) => {
    var newTags = tags?.map(({ name }) => ({ name }));
    newTags = newTags?.filter(el => el.name !== name)
    await mutateAsync({
      tags: newTags
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
                <IconCategoryMinus />
              </button>
            </div>
          )}
          {(tags?.length || 0 < maxTags) ? (
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
                    <IconX />
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
                      <IconCategoryPlus />
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