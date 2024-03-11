import { useParams } from "react-router-dom";
import { useContext } from "react";

// servies
import AuthContext from "@/services/contexts/authContext";
import { useUser } from "@/services/hooks/user/useUser";

// types
import { AuthContextType } from "@/services/contexts/models";

// components
import { ConnectionStatus } from "./connection-status";
import { ProfilePicture } from "./profile-picture";
import { AggregatedConnections } from "./aggregate-connections";
import { AggregatedRecipes } from "./aggregate-recipes";

export const UserDetails = () => {

  const { userId } = useParams();

  const { user: activeUser } = useContext(AuthContext) as AuthContextType
  const activeUserId = activeUser?.id;

  const { data: user, isLoading, isError } = useUser({ userId })

  if (isLoading) return (<div></div>);

  if (isError || !user) throw new Error(`user ${userId} not found!`);

  return (
    <>
      <section
        className="relative aspect-square w-full max-w-56 items-center flex overflow-hidden mr-3"
      >
        <ProfilePicture user={user} />
      </section>
      <section
        className="py-3 md:py-0 md:pl-5 text-sm grow"
      >
        <div className="text-lg font-bold pb-3">{user?.username}</div>
        <AggregatedRecipes />
        <AggregatedConnections />
        <div className="py-1">Works @ la.dispensa</div>
        <div className="py-1">Recipe Publisher</div>
        {activeUserId !== userId && (
          <div className="my-3">
            <ConnectionStatus user={user} />
          </div>
        )}
      </section>
    </>
  )
}