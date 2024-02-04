import { useQuery } from "@tanstack/react-query";
import { getRecipe } from "../../api/recipe";
import { useParams } from "react-router-dom";
import ImgNotAvailable from "../../assets/Image_not_available.png"
import { useState } from "react";
import { Add } from "../../assets/icons";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { uploadPhoto } from "../../api/recipe";


export default function Recipe() {

  const { recipeId } = useParams();

  const { isPending, isError, data: recipe, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const queryClient = useQueryClient()

  const { mutateAsync: uploadPhotoMutation } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe'])
    }
  })

  const [editImage, setEditMode] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex space-x-3">
      <div className="w-7/12 space-y-4">
        <div
          className={`w-full aspect-square relative items-center`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={recipe?.image ? recipe.image : ImgNotAvailable}
            onChange={(e) => setEditMode(false)}
            className="object-cover asbolute top-0 right-0 h-full w-full" />
          {isHovered && (
            <div
              className="absolute top-0 left-0 h-full w-full
                            bg-black/50 flex justify-center items-center
                            text-white cursor-pointer"
              onClick={(e) => setEditMode(true)}>
              <p>Click to Change</p>
            </div>
          )}
        </div>
        <div
          className={`flex justify-center ${editImage ? "" : "hidden"}`}
        >
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/gif"
            onChange={(event) => {
              let file = event.currentTarget.files[0];
              setSelectedImage(event.target.files[0]);
              let formData = new FormData();
              formData.append('photo', file)
              uploadPhotoMutation({ formData, recipeId })
            }}
          >
          </input>
          <button>
            <img src={Add} alt="add" />
          </button>
        </div>
      </div>
      <div className="w-4/12">
        <div className="italic"> By: {recipe?.author.username}</div>
        <div>
          {(recipe?.description) ? (
            recipe.description
          ) : (
            'No descriptor for this recipe has been given'
          )}
        </div>
        <div>
          Time to prepare (approx.)
          {(recipe?.time) ? (`${recipe.time} mins`) : (' not given')}
        </div>
      </div>
    </div>
  )
}