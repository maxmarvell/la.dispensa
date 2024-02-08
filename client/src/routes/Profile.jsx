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

  const [editing, setEditing] = useState(false);

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
    <div className="grow divide-y pb-0 p-10 pr-20 flex flex-col h-full overflow-y-scroll">
      <div className="flex divide-x mb-2">
        <section
          className="relative aspect-square w-1/4 items-center flex overflow-hidden mr-3"
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
          <button
            className={`p-1 border-2 absolute top-2 left-2 ${editing ? "bg-orange-300 border-orange-300" : "bg-slate-950 border-slate-950"}`}
            onClick={() => setEditing(!editing)}
          >
            <img src={editing ? dark.Edit : light.Edit} alt="edit this page" />
          </button>
        </section>
        <section
          className="pl-5 grow divide-y"
        >
          <div className="text-lg font-bold pb-1">{user?.username}</div>
          <div className="py-1">where does he work</div>
          <div className="py-1">what does he do</div>
          <div className="py-1">how many connections does he have</div>

        </section>
      </div>
      <section className="mb-10 pt-2">
        <RecipeGallery />
      </section>
    </div>
  )
}