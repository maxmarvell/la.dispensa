import { useContext, useState } from "react";

// ui components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IconEdit } from "@tabler/icons-react";
import { FileUploader } from "react-drag-drop-files";

// services
import AuthContext from "@/services/contexts/authContext";
import { useUpdateProfilePicture } from "@/pages/profile/hooks/useUpdateProfilePicture";

// types
import { AuthContextType } from "@/services/contexts/models";
import { ProfilePictureProps } from "@/pages/profile/models";

const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

export const ProfilePicture = ({ user }: ProfilePictureProps) => {

  const { user: activeUser } = useContext(AuthContext) as AuthContextType;
  const userId = activeUser?.id;

  const { image, username, id } = user;

  const [editing, setEditing] = useState(false);

  const { mutateAsync } = useUpdateProfilePicture({ userId })

  // Handle Image Upload
  const [_, setFile] = useState<File | null>(null);
  const handleChange = async (file: File) => {
    setFile(file);
    let input = new FormData();
    input.append('photo', file);
    await mutateAsync({ input });
    setEditing(false)
  };

  return (
    <>
      <Avatar>
        <AvatarImage src={image} />
        <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
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
      )
      }
      {
        id === userId && (
          <button
            className={`p-1 border-2 absolute top-2 left-2 ${editing ? "bg-orange-300 border-orange-300" : "bg-slate-950 border-slate-950"}`}
            onClick={() => setEditing(!editing)}
          >
            <IconEdit color={editing ? "rgb(2 6 23)" : "rgb(253 186 116)"} size={24} />
          </button>
        )
      }
    </>
  )
};