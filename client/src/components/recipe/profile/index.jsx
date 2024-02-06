import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getRecipe } from "../../../api/recipe";
import * as dark from "../../../assets/icons/dark/index";
import * as light from "../../../assets/icons/light/index";
import { uploadPhoto } from "../../../api/recipe";
import AggregateRating from "./aggregateRating";
import Tags from "./tags";
import { FileUploader } from "react-drag-drop-files";


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];


const Profile = ({ reviewsRef, recipeRef }) => {

  const { recipeId } = useParams();

  const navigate = useNavigate();

  const { isLoading, isError, data: recipe, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });


  // Extract the date in a more readable format
  let d = new Date(recipe?.createdOn);
  const month = months[d.getMonth()];
  const date = d.getDate()
  const year = d.getFullYear()


  const [editing, setEditing] = useState(false)
  const queryClient = useQueryClient();


  // Upload the image
  const { mutateAsync: uploadPhotoMutation } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe'])
    }
  })

  // Handle Image Upload
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    let formData = new FormData();
    formData.append('photo', file);
    uploadPhotoMutation({ formData, recipeId });
  };

  // auto scroll to main body on button click
  const executeScroll = (ref) => ref.current.scrollIntoView({ behavior: "smooth" })


  return (
    <>
      <div className="flex flex-col my-auto items-center w-1/2">
        <section className="mb-8">
          <Tags editing={editing} />
        </section>
        <div className="text-5xl capitalize mb-5 px-10 text-center">
          {recipe?.title}
        </div>
        <div className="text-xs uppercase mb-1">
          By {recipe?.author.username}
        </div>
        <div className="text-xs text-gray-400 capitalize">
          {month} {date}, {year}
        </div>
        <div className="text-lg mt-4 space-x-3 capitalize flex items-center">
          <AggregateRating />
        </div>
        <button
          className="text-xs underline capitalize"
          onClick={() => executeScroll(reviewsRef)}
        >
          Read the Reviews
        </button>
        <div className="mt-6">
          <Link
            className="bg-slate-950 flex text-white text-xs px-2 py-1"
            to={`/test-kitchen/${recipeId}`}
          >
            <div className="my-auto">Test Kitchen</div>
            <img src={light.ArrowRight} alt="" />
          </Link>
        </div>
      </div>
      <div className="h-full w-1/2 relative">
        <img
          src={recipe?.image} alt={`display photo - ${recipe?.title}`}
          className="object-cover h-full w-full"
        />
        {editing && (
          <div
            className="absolute top-0 left-0 h-full w-full
              bg-black/50 flex justify-center items-center
              text-white cursor-pointer text-center"
          >
            <FileUploader
              handleChange={handleChange} name="file" types={fileTypes}
              classes="h-full w-full text-white cursor-pointer text-center grow drag-drop"
              maxSize={4}
            />
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black opacity-40" />
      <button
        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-1 bg-slate-950 h-12 w-8 group"
        onClick={() => executeScroll(recipeRef)}
      >
        <img
          className="object-fill animate-bounce"
          src={light.ArrowDown} alt="go to recipe"
        />
      </button>
      <div className="absolute top-2 left-2 space-x-4">
        <button
          className={`p-1 border-2 ${editing ? "bg-orange-300 border-orange-300" : "bg-slate-950 border-slate-950"}`}
          onClick={() => navigate("/recipes/")}
        >
          <img src={light.RefundBack} alt="go back to recipes" />
        </button>
        <button
          className={`p-1 border-2 ${editing ? "bg-orange-300 border-orange-300" : "bg-slate-950 border-slate-950"}`}
          onClick={() => setEditing(!editing)}
        >
          <img src={editing ? dark.Edit : light.Edit} alt="edit this page" />
        </button>
      </div>
    </>
  )
}


export default Profile;