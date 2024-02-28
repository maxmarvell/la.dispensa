import { useContext, useEffect, useState } from "react"
import AuthContext from "../../context/auth"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserFeed } from "../../api/dashboard";
import { Link } from "react-router-dom";
import { User } from "../../assets/icons/dark";
import { createConnection, acceptConnection, removeConnection } from "../../api/user";
import { UserType } from "../../@types/user";
import { AuthContextType } from "../../@types/context";


const take = 10;

const UserRow = ({ user }: { user: UserType }) => {

  const { user: currUser } = useContext(AuthContext) as AuthContextType;
  const userId = currUser?.id;

  const { connectedWith, connectedBy } = user;

  const isConnectedWith = connectedWith.find(({ connectedWithId }) => connectedWithId === userId);
  const isConnectedBy = connectedBy.find(({ connectedById }) => connectedById === userId);
  const isConnected = isConnectedBy || isConnectedWith;

  const connectionFn = ({ userId }: { userId: string }) => {
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

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: connectionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-feed"] });
    }
  });

  const ConnectionStatus = () => {
    return (
      <button
        className="bg-slate-950 text-white hover:text-slate-950 hover:bg-orange-300 
                     px-2 py-1 text-xs"
        onClick={() => mutateAsync({ userId: user.id })}
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
          <img
            src={user.image ? user.image : User} alt=""
            className="object-cover h-full w-full rounded-full"
          />
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


export const UsersFeed = () => {
  const { user } = useContext(AuthContext) as AuthContextType;

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user-feed"] })
  }, [user]);

  const [username, setUsername] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["user-feed", username],
    queryFn: () => getUserFeed({ username, take }),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Search for users"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border-0 border-b-2 border-slate-950 bg-transparent
                   focus:outline-none focus:border-orange-300"
        />
        {Array.from(Array(8).keys()).map(el => (
          <div key={el} className="flex justify-between items-center border bg-slate-100 animate-pulse">
            <div className="flex items-center space-x-1">
              <div className="h-14 p-2 aspect-square rounded-full">
                <div className="object-cover h-full w-full rounded-full bg-slate-300" />
              </div>
              <div className="h-4 w-20 bg-slate-300 rounded-full " />
            </div>
            <div className="pr-4">
              <div className="h-4 w-10 bg-slate-300 px-2 py-1" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-3">
      <input
        type="text"
        placeholder="Search for users"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border-0 border-b-2 border-slate-950 bg-transparent
                   focus:outline-none focus:border-orange-300"
      />
      {data?.map((user, index) => (
        <UserRow user={user} key={index} />
      ))}
    </div>
  )
}