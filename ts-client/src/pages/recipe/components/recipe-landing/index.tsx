import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";

import { formatDate } from "@/utils/date-format";

// components
import { IconArrowBackUp, IconEdit, IconArrowNarrowDown, IconArrowNarrowRight } from '@tabler/icons-react';
import { FileUploader } from "react-drag-drop-files";
import { AggregateRating } from "./aggregated-rating";
import { Tags } from "./tags";

// services
import AuthContext from "@/services/contexts/authContext";
import { useRecipe } from "@/services/hooks/recipe/useRecipe";
import { useUpdateRecipePicture } from "../../hooks/useUpdateRecipePhoto";
import { useUpdateRecipe } from "../../hooks/useUpdateRecipe";

// types
import { AuthContextType } from "@/services/contexts/models";
import { RecipeLandingProps } from "../../models";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

export const Profile = ({ reviewsRef, recipeRef }: RecipeLandingProps) => {

  const { recipeId } = useParams();

  const navigate = useNavigate();

  // fetch recipe
  const { getRecipeById } = useRecipe();
  const { data: recipe } = getRecipeById({ recipeId })

  // extract the date in a more readable format
  const { month, date, year } = formatDate(recipe?.createdOn)

  // use editing state
  const [editing, setEditing] = useState(false)

  // upload photo mutation
  const { mutateAsync: uploadPhotoMutation } = useUpdateRecipePicture({ recipeId })

  // handle image Upload
  const [_, setFile] = useState<File | null>(null);
  const handleChange = (file: File) => {
    setFile(file);
    let input = new FormData();
    input.append('photo', file);
    uploadPhotoMutation({ input });
  };

  // auto scroll to main body on button click
  const executeScroll = (ref: React.RefObject<HTMLDivElement>) => ref?.current?.scrollIntoView({ behavior: "smooth" })

  // handle user edit title
  const [title, setTitle] = useState(recipe?.title);
  const { mutateAsync: editMutation } = useUpdateRecipe({ recipeId });
  const handleEditTitle = async () => {
    await editMutation({ title });
  }

  // extract id of current user
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const isAuthor = (userId === recipe?.authorId);
  const isEditor = recipe?.editors?.find(el => el.userId === userId);

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
              <IconArrowNarrowRight
                size={24}
                color="rgb(253 186 116)"
                stroke={3}
              />
            </Link>
          </div>
        ) : (
          null
        )}
      </div>
      <div className="h-1/2 lg:h-full lg:w-1/2 relative">
        <Avatar>
          <AvatarImage src={recipe?.image}/>
          <AvatarFallback>{recipe?.title}</AvatarFallback>
        </Avatar>
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
        <IconArrowNarrowDown
          size={24}
          color="rgb(253 186 116)"
          stroke={3}
        />
      </button>
      <div className="absolute top-2 left-2 space-x-4">
        <button
          className={`p-1 border-2 border-slate-950 bg-slate-950 hover:bg-orange-300`}
          onClick={() => navigate("/recipes/")}
        >
          <IconArrowBackUp
            size={24}
            color="rgb(253 186 116)"
            stroke={3}
          />
        </button>
        {isAuthor ? (
          <button
            className={`p-1 border-2 border-slate-950 hover:bg-orange-300 ${editing ? "bg-orange-300" : "bg-slate-950"}`}
            onClick={() => setEditing(!editing)}
          >
            <IconEdit
              size={24}
              color="rgb(253 186 116)"
              stroke={3}
            />
          </button>
        ) : (
          null
        )}
      </div>
    </>
  )
}

export default Profile;