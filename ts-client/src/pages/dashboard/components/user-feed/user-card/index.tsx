import { Link } from "react-router-dom";
import { useContext } from "react";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// context
import AuthContext from "@/services/contexts/authContext";

// types
import { UserCardProps } from "@/pages/dashboard/models";
import { AuthContextType } from "@/services/contexts/models";

// hooks
import { useToggleConnection } from "@/services/hooks/connections/useToggleConnection";

export const UserCard = ({ user }: UserCardProps) => {

  const { user: currUser } = useContext(AuthContext) as AuthContextType;
  const userId = currUser?.id;

  const { connectedWith, connectedBy } = user;

  const isConnectedWith = connectedWith.find(({ connectedWithId }) => connectedWithId === userId);
  const isConnectedBy = connectedBy.find(({ connectedById }) => connectedById === userId);
  const isConnected = isConnectedBy || isConnectedWith;

  // mutation
  const { mutateAsync } = useToggleConnection({ userId })

  const ConnectionStatus = () => {
    return (
      <button
        className="bg-slate-950 text-white hover:text-slate-950 hover:bg-orange-300 
                     px-2 py-1 text-xs"
        onClick={() => mutateAsync({
          connected: isConnected ? true : false,
          accepted: isConnected?.accepted,
          connectedWith: isConnected?.connectedWithId === userId
        })}
      >
        {isConnected ? isConnected.accepted ? "Friends" : (isConnected.connectedWithId === userId) ? "Accept" : "Requested" : "Add"}
      </button>
    )
  };

  return (
    <div className="flex border justify-between items-center">
      <Link
        to={`/profile/${user.id}`}
        className="flex items-center space-x-1"
      >
        <div className="w-14 p-2 aspect-square">
          <Avatar className="rounded-full">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="hover:underline">
            {user.username}
          </div>
        </div>
      </Link>
      <div className="pr-2">
        <ConnectionStatus />
      </div>
    </div>
  );
};