import React, { useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";

// services
import { useRecipe } from "@/services/hooks/recipe/useRecipe";
import { useUpdateRecipe } from "../../hooks/useUpdateRecipe";
import AuthContext from "@/services/contexts/authContext";

// types
import { AuthContextType } from "@/services/contexts/models";

// icons
import { IconEdit, IconDeviceFloppy } from "@tabler/icons-react";

export const Description = () => {

  // Extract recipe id and user
  const { recipeId } = useParams();
  const { user } = useContext(AuthContext) as AuthContextType;

  // Retrieve the recipe and extract the author id
  const { getRecipeById } = useRecipe();
  const { data: recipe, isLoading } = getRecipeById({ recipeId })
  const authorId = recipe?.authorId;

  const [description, setDescription] = useState(recipe?.description);

  const descriptionHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let { target } = e;
    let { value } = target;
    setDescription(value)
    adjustTextareaHeight(target);
  }

  const ref = useRef<HTMLTextAreaElement | null>(null);

  const [editing, setEditing] = useState(false);

  const handleClickEdit = () => {
    setEditing(!editing);
    window.setTimeout(() => {
      if (!editing) {
        if (!ref?.current) return;
        ref.current.focus();
        adjustTextareaHeight(ref.current);
        let inputLength = ref.current.value.length;
        ref?.current?.setSelectionRange(inputLength, inputLength);
      }
    }, 0);
  };

  const EditButton = () => {
    let [_, setHovered] = useState(false);
    if (editing) {
      return (
        <button
          className="bg-orange-300 border-2 border-orange-300"
          onClick={handleClickEdit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconEdit />
        </button>
      );
    } else {
      return (
        <button
          className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
          onClick={handleClickEdit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconEdit />
        </button>
      );
    }
  }

  const { mutateAsync: editMutation } = useUpdateRecipe({ recipeId });

  const handleUpdate = async () => {
    let result = await editMutation({ description });
    if (result) {
      setEditing(false)
    };
  };

  const UpdateButton = () => {
    let [_, setHovered] = useState(false);
    return (
      <button
        className="bg-slate-950 border-2 border-slate-950 hover:bg-orange-300"
        onClick={handleUpdate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <IconDeviceFloppy />
      </button>
    )
  }

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  if (isLoading) {
    return (
      <div></div>
    )
  }

  // Render non-authorized display
  if (authorId !== user?.id) {
    return (
      <div className="text-sm border-transparent border-l-4 pl-2">
        {recipe?.description?.split(/\n/).map((line, index) =>
          <div key={index}>{line}</div>
        ) || "The author still needs to include a description"}
      </div>
    );
  };

  // Render 
  if (!recipe?.description) {
    return (
      <div className="text-sm min-h-14 flex justify-between border-transparent border-l-4 focus-within:border-orange-300">
        <label className="grow">
          <textarea
            ref={ref}
            value={description || ""}
            onChange={descriptionHandler}
            className="w-full border-none focus:outline-0 pl-2 overflow-y-hidden resize-none"
            placeholder="Description should be written here"
          />
        </label>
        <div>
          <UpdateButton />
        </div>
      </div>
    );
  };

  return (
    <div className="text-sm flex min-h-14 justify-between border-transparent border-l-4 focus-within:border-orange-300">
      {editing ? (
        <label className="grow">
          <textarea
            ref={ref}
            value={description || ""}
            onChange={descriptionHandler}
            className="w-full border-none focus:outline-0 pl-2 overflow-y-hidden resize-none"
            placeholder="Description should be written here"
          />
        </label>
      ) : (
        <div className="pl-2">
          {recipe?.description.split(/\n/).map((line, index) =>
            <div key={index}>{line}</div>
          )}
        </div>
      )}
      <div className="flex flex-col min-w-fit space-y-1 pl-3">
        <EditButton />
        {editing ? (
          <UpdateButton />
        ) : (
          null
        )}
      </div>
    </div>
  )
}