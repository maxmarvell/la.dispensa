import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// APIs
import { get as getUser, uploadPhoto, removeConnection, acceptConnection, createConnection } from "../api/user";

// Components
import RecipeGallery from "../components/profile/recipeGallery";
import { AggregatedRecipes } from "../components/profile/aggregatedRecipes";
import { AggregatedConnections } from "../components/profile/aggregatedConnections";
import { FileUploader } from "react-drag-drop-files";

// Assets
import * as light from '../assets/icons/light'
import * as dark from '../assets/icons/dark'
import AuthContext from "../context/auth";
import { AuthContextType } from "../@types/context";

const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

export default function Profile() {

  const { userId } = useParams();

  const { user: currentUser } = useContext(AuthContext) as AuthContextType;
  const currentUserId = currentUser?.id;

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser({ userId })
  });

  const isConnectedWith = user?.connectedWith.find(({ connectedWithId }) => connectedWithId === currentUserId);
  const isConnectedBy = user?.connectedBy.find(({ connectedById }) => connectedById === currentUserId);
  const isConnected = isConnectedBy || isConnectedWith;

  const queryClient = useQueryClient();

  const { mutateAsync: uploadPhotoMutation } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    }
  });

  const [editing, setEditing] = useState(false);

  // Handle Image Upload
  const [_, setFile] = useState<File | null>(null);
  const handleChange = async (file: File) => {
    setFile(file);
    let formData = new FormData();
    formData.append('photo', file);
    await uploadPhotoMutation({ formData, userId });
    setEditing(false)
  };

  const connectionFn = ({ userId }: { userId: string | null }) => {
    if (!userId) return Promise.resolve(null);

    return isConnected ? (
      isConnected.accepted ? (
        removeConnection({ userId })
      ) : (
        isConnected.connectedWithId === userId ? (
          removeConnection({ userId })
        ) : (
          acceptConnection({ userId })
        )
      )
    ) : (
      createConnection({ userId })
    )
  };

  const { mutateAsync } = useMutation({
    mutationFn: connectionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    }
  });

  const ConnectionStatus = () => {
    return (
      <button
        className="bg-slate-950 text-white hover:text-slate-950 hover:bg-orange-300 
                     px-2 py-1 text-xs"
        onClick={() => mutateAsync({ userId: user?.id || null })}
      >
        {isConnected ? isConnected.accepted ? "Friends" : (isConnected.connectedWithId === userId) ? "Accept" : "Requested" : "Add"}
      </button>
    )
  };


  if (isLoading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="grow divide-y pb-0 p-10 pr-20 flex flex-col h-full overflow-y-scroll">
      <div className="flex md:divide-x mb-2 flex-col md:flex-row">
        <section
          className="relative aspect-square w-full max-w-56 items-center flex overflow-hidden mr-3"
        >
          <img
            src={user?.image ? user.image : dark.User}
            className="object-cover h-full w-full"
          />
          {editing && (
            <div
              className="absolute inset-0
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
          {currentUserId === userId && (
            <button
              className={`p-1 border-2 absolute top-2 left-2 ${editing ? "bg-orange-300 border-orange-300" : "bg-slate-950 border-slate-950"}`}
              onClick={() => setEditing(!editing)}
            >
              <img src={editing ? dark.Edit : light.Edit} alt="edit this page" />
            </button>
          )}
        </section>
        <section
          className="py-3 md:py-0 md:pl-5 text-sm grow"
        >
          <div className="text-lg font-bold pb-3">{user?.username}</div>
          <AggregatedRecipes />
          <AggregatedConnections />
          <div className="py-1">Works @ la.dispensa</div>
          <div className="py-1">Recipe Publisher</div>
          {currentUserId !== userId && (
            <div className="my-3">
              <ConnectionStatus />
            </div>
          )}
        </section>
      </div>
      <section className="mb-10 pt-2">
        <RecipeGallery />
      </section>
    </div>
  )
}