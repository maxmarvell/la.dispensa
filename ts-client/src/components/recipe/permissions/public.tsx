import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as dark from "../../../assets/icons/dark"
import { editRecipe, getRecipe } from "../../../api/recipe";
import { useParams } from "react-router-dom";

const Public = () => {

  const { recipeId } = useParams();

  const { data } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const queryClient = useQueryClient();

  const isPublic = data?.public;

  const { mutateAsync } = useMutation({
    mutationFn: editRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['recipe', recipeId]})
    }
  })

  const handlePublicise = async () => {
    let result = await mutateAsync({ recipeId, data: { public: !isPublic } });
    console.log(result)
  }

  // Calculate metrics to determine if profile is complete
  const imageUploaded = data?.image ? 1 : 0;
  const descriptionAdded = data?.description ? 1 : 0;
  const instructionsAdded = data?.instructions?.length ? 1 : 0;
  const ingredientsAdded = data?.ingredients?.length ? 1 : 0;

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
              <img src={dark.Eye} alt="change public setting" />
            </button>
          </div>
        ) : (
          progressStatement()
        )}
    </div>
  );
};

export default Public;