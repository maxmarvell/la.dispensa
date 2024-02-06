import { useQuery } from "@tanstack/react-query";
import { getConnections } from "../../api/user";
import { Link, useParams } from "react-router-dom";
import * as dark from "../../assets/icons/dark";




const UserCard = ({ user }) => {

  return (
    <Link 
      className="flex flex-col items-center px-5 first:pl-1 last:pr-1 py-1 relative"
      to={`/profile/${user.id}`}
      >
      <div
        className={`size-32 items-center flex cursor-pointer`}
      >
        <img
          src={(user.image) ? (
            user.image
          ) : (
            dark.User
          )}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="text-center mt-2">{user.username}</div>
    </Link>
  )
}


const Connections = () => {

  const { userId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['connections', userId],
    queryFn: () => getConnections({ userId })
  })

  return (
    <div className="flex items-center overflow-x-auto">
      {data?.map(({ connectedWith: user }, index) => (
        <UserCard
          user={user}
          key={index}
        />
      ))}
    </div>
  );
};

export default Connections;