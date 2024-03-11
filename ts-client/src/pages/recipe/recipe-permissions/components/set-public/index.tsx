import { useParams } from "react-router-dom";

// services
import { useRecipe } from "@/services/hooks/recipe/useRecipe";

// components
import { IconEye } from "@tabler/icons-react";
import { usePublish } from "../../hooks/usePublish";

export const Public = () => {

  const { recipeId } = useParams();

  const { getRecipeById } = useRecipe();
  const { data: recipe } = getRecipeById({ recipeId });

  const isPublic = recipe?.public;

  const { mutateAsync } = usePublish({ recipeId })

  const handlePublicise = async () => {
    await mutateAsync({ publish: !isPublic });
  }

  // Calculate metrics to determine if profile is complete
  const imageUploaded = recipe?.image ? 1 : 0;
  const descriptionAdded = recipe?.description ? 1 : 0;
  const instructionsAdded = recipe?.instructions?.length ? 1 : 0;
  const ingredientsAdded = recipe?.ingredients?.length ? 1 : 0;

  // Progress on recipe completion
  const progress = ((imageUploaded + descriptionAdded + instructionsAdded + ingredientsAdded) / 4) * 100;

  const progressStatement = () => {
    if (!imageUploaded) {
      return (
        <div>not complete: You need to Upload a Cover Photo</div>
      );
    };
    if (!descriptionAdded) {
      return (
        <div>not complete: You need to add a Description</div>
      );
    };
    if (!instructionsAdded) {
      return (
        <div>not complete: You need to Add some Instructions</div>
      );
    };
    if (!ingredientsAdded) {
      return (
        <div>not complete: You need to Add some Ingredients</div>
      );
    };
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-2/3 h-6 bg-slate-950 border-2 border-slate-950">
        <div
          style={{ width: `${progress}%` }}
          className="bg-orange-300 h-full flex items-center justify-center text-xs font-medium text-slate-950 p-0.5 leading-none">
          {progress}%
        </div>
      </div>
      {(progress === 100) ? (
        <div className="flex flex-col items-center pt-5">
          <div className="text-sm text-center max-w-44 border-b border-slate-950 mb-3">
            {isPublic ? (
              "This recipe is publicly accessible, click here to make it private"
            ) : (
              "This recipe is currently accessible only to you, click here to make it public"
            )}
          </div>
          <button
            className={`border-2 hover:border-orange-300 hover:bg-orange-300 
                         ${isPublic ? "bg-orange-300 border-orange-300" : "border-slate-950 "}`}
            onClick={handlePublicise}
          >
            <IconEye />
          </button>
        </div>
      ) : (
        progressStatement()
      )}
    </div>
  );
};