import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { editRecipe, getRecipe } from "../../../api/recipe";
import { uploadPhoto } from "../../../api/recipe";
import AggregateRating from "./aggregatedRecipe";
import Tags from "./tags";
import { FileUploader } from "react-drag-drop-files";
import AuthContext from "../../../context/auth";

import * as dark from "../../../assets/icons/dark/index";
import * as light from "../../../assets/icons/light/index";
import { AuthContextType } from "../../../@types/context";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];


type ProfilePropsType = {
  reviewsRef: React.RefObject<HTMLDivElement>,
  recipeRef: React.RefObject<HTMLDivElement>,
}


const Profile = ({ reviewsRef, recipeRef }: ProfilePropsType) => {

  const { recipeId } = useParams();

  const navigate = useNavigate();

  const { data: recipe } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });


  // Extract the date in a more readable format
  let d = new Date(recipe?.createdOn || 0);
  const month = months[d.getMonth()];
  const date = d.getDate()
  const year = d.getFullYear()


  const [editing, setEditing] = useState(false)
  const queryClient = useQueryClient();


  // Upload the image
  const { mutateAsync: uploadPhotoMutation } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe'] })
    }
  })

  // Handle Image Upload
  const [_, setFile] = useState<File | null>(null);
  const handleChange = (file: File) => {
    setFile(file);
    let formData = new FormData();
    formData.append('photo', file);
    uploadPhotoMutation({ formData, recipeId });
  };

  // auto scroll to main body on button click
  const executeScroll = (ref: React.RefObject<HTMLDivElement>) => ref?.current?.scrollIntoView({ behavior: "smooth" })

  // Handle user edit title
  const [title, setTitle] = useState(recipe?.title);
  const { mutateAsync: editMutation } = useMutation({
    mutationFn: editRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe'] })
    }
  });
  const handleEditTitle = async () => {
    await editMutation({ recipeId, data: { title } });
  }

  const { user } = useContext(AuthContext) as AuthContextType;

  const id = user?.id;

  const isAuthor = (id === recipe?.authorId);
  const isEditor = recipe?.editors?.find(el => el.userId === id);

  return (
    <>
      <div className="flex flex-col my-auto items-center py-5 lg:py-0 lg:w-1/2">
        <section className="min-h-6 mb-8">
          <Tags editing={editing} />
        </section>
        {editing ? (
          <input
            className="text-xl lg:text-5xl capitalize lg:mb-5 mx-10 bg-transparent text-center "
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="type recipe title here..."
            onBlur={handleEditTitle}
          />
        ) : (
          <div className="text-xl lg:text-5xl capitalize lg:mb-5 px-10 text-center">
            {recipe?.title}
          </div>
        )}
        <div className="text-xs uppercase mb-1">
          By {recipe?.author.username}
        </div>
        <div className="text-xs text-gray-400 capitalize">
          {month} {date}, {year}
        </div>
        <div className="text-lg mt-1 lg:mt-4 space-x-3 capitalize flex items-center">
          <AggregateRating />
        </div>
        <button
          className="text-xs underline capitalize"
          onClick={() => executeScroll(reviewsRef)}
        >
          Read the Reviews
        </button>
        {(isEditor || isAuthor) ? (
          <div className="mt-6">
            <Link
              className="bg-slate-950 border-2 border-slate-950 flex text-white hover:bg-orange-300 
                       hover:text-slate-950 text-xs px-2 py-1"
              to={`/test-kitchen/${recipeId}`}
            >
              <div className="my-auto">Test Kitchen</div>
              <img src={light.ArrowRight} alt="" />
            </Link>
          </div>
        ) : (
          null
        )}
      </div>
      <div className="h-full lg:w-1/2 relative">
        <img
          src={recipe?.image || dark.BookOpen}
          alt={`display photo - ${recipe?.title}`}
          className={`w-full ${recipe?.image ? "object-cover h-full" : "mt-52"}`}
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
          className={`p-1 border-2 border-slate-950 bg-slate-950 hover:bg-orange-300`}
          onClick={() => navigate("/recipes/")}
        >
          <img
            src={light.RefundBack} alt="go back to recipes"
          />
        </button>
        {isAuthor ? (
          <button
            className={`p-1 border-2 border-slate-950 hover:bg-orange-300 ${editing ? "bg-orange-300" : "bg-slate-950"}`}
            onClick={() => setEditing(!editing)}
          >
            <img src={editing ? dark.Edit : light.Edit} alt="edit this page" />
          </button>
        ) : (
          null
        )}
      </div>
    </>
  )
}


export default Profile;