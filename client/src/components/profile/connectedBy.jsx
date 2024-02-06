import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getConnectedBy } from "../../api/profile";
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

const ConnectedBy = () => {

  const { userId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['connectedBy', userId],
    queryFn: () => getConnectedBy({ userId })
  })



  return (
    <div className="flex items-center overflow-x-auto">
      {data?.map(({ connectedBy: user }, index) => (
        <UserCard
          user={user}
          key={index}
        />
      ))}
    </div>
  );
};

export default ConnectedBy;