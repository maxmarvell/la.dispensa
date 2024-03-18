import { useParams } from "react-router-dom"

// services
import { useEditor } from "../../hooks/useEditor";

// components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// types
import { UserCardProps } from "../../models";

export const Card = ({ user, setSelectedUser, selectedUser }: UserCardProps) => {

  const { recipeId } = useParams();

  const { getEditors: { data: editors } } = useEditor({ recipeId });

  const editor = editors?.map(({ userId }) => userId)?.includes(user.id);

  const selected = user === selectedUser;

  return (
    <div className="flex flex-col items-center px-5 first:pl-1 last:pr-1 py-1 relative">
      <div
        className={`size-32 items-center flex cursor-pointer rounded-full overflow-hidden
                    ${selected && "ring-4 ring-orange-300"}`}
        onClick={() => setSelectedUser(user)}
      >
        <Avatar>
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="text-center mt-2">{user.username}</div>
      {editor &&
        <div className="text-orange-600 text-xs rounded-full absolute top-2 right-2 py-1 px-2 bg-orange-300">editor</div>
      }
    </div>
  );
};