import { useContext } from "react";

// services
import AuthContext from "@/services/contexts/authContext";
import { useToggleConnection } from "@/services/hooks/connections/useToggleConnection";

// types
import { ConnectionStatusProps } from "@/pages/profile/models";
import { AuthContextType } from "@/services/contexts/models";

export const ConnectionStatus = ({ user }: ConnectionStatusProps) => {

  const { user: activeUser } = useContext(AuthContext) as AuthContextType
  const activeUserId = activeUser?.id

  const userId = user.id;
  const isConnectedWith = user?.connectedWith?.find(({ connectedWithId }) => connectedWithId === activeUserId);
  const isConnectedBy = user?.connectedBy?.find(({ connectedById }) => connectedById === activeUserId);
  const isConnected = isConnectedBy || isConnectedWith;

  const { mutateAsync } = useToggleConnection({ userId })

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