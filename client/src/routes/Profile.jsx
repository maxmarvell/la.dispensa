import { User, Add } from "../assets/icons"
import { useParams } from "react-router-dom";
import { get as getUser, uploadPhoto } from "../api/user";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FileUploader } from "react-drag-drop-files";
import * as light from '../assets/icons/light'
import * as dark from '../assets/icons/dark'
import RecipeGallery from "../components/profile/recipeGallery";
import Connections from "../components/profile/connections";
import ConnectedBy from "../components/profile/connectedBy";

const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

export default function Profile() {

  const { userId } = useParams();

  const { isLoading, isError, data: user, error } = useQuery({ queryKey: ['user', userId], queryFn: () => getUser({ userId }) })


  const queryClient = useQueryClient();

  const { mutateAsync: uploadPhotoMutation } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe'])
    }
  });

  const [editing, setEditing] = useState(false)

  // Handle Image Upload
  const [file, setFile] = useState(null);
  const handleChange = async (file) => {
    setFile(file);
    let formData = new FormData();
    formData.append('photo', file);
    await uploadPhotoMutation({ formData, userId });
    setEditing(false)
  };


  if (isLoading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="grow divide-x p-10 pr-20 flex h-full">
      <div className="flex flex-col w-3/12 max-w-72 pr-3 divide-y">
        <div
          className="relative mx-1 aspect-square items-center flex overflow-hidden pb-2"
        >
          <img
            src={user?.image ? user.image : User}
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
          <button
            className={`p-1 border-2 absolute top-2 left-2 ${editing ? "bg-orange-300 border-orange-300" : "bg-slate-950 border-slate-950"}`}
            onClick={() => setEditing(!editing)}
          >
            <img src={editing ? dark.Edit : light.Edit} alt="edit this page" />
          </button>
        </div>
        <div className="text-lg font-bold py-2">{user?.username}</div>
      </div>
      <div className="w-9/12 space-y-5 pl-5 lg:pr-32 pr-12 min-h-full flex flex-col justify-around overflow-auto">
        <section className="">
          <div className="flex justify-center mb-2">
            <p className="text-xl uppercase px-10 border-b text-center">Gallery</p>
          </div>
          <RecipeGallery />
        </section>
        <section>
          <div className="flex justify-center mb-2">
            <p className="text-xl uppercase px-10 border-b text-center">Connected With</p>
          </div>
          <Connections />
        </section>
        <section>
          <div className="flex justify-center mb-2">
            <p className="text-xl uppercase px-10 border-b text-center">Connected By</p>
          </div>
          <ConnectedBy />
        </section>
      </div>
    </div>
  )
}