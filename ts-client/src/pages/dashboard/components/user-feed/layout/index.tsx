import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// contexts
import AuthContext from "@/services/contexts/authContext";

// child components
import { UserCard } from "../user-card";

// hooks
import { useUserSearch } from "@/pages/dashboard/hooks/useUserSearch";
import { UserCardSkeleton } from "../user-card/skeleton";

// types
import { AuthContextType } from "@/services/contexts/models";

// defaults
const defaultTake = 10;

export const UsersFeedLayout = () => {
  const { user } = useContext(AuthContext) as AuthContextType;

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user-feed"] })
  }, [user]);

  const [username, setUsername] = useState("")
  const [take, _] = useState(defaultTake)

  const { data, isLoading } = useUserSearch({ take, username })

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
          <UserCardSkeleton key={el} />
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
        <UserCard user={user} key={index} />
      ))}
    </div>
  )
}