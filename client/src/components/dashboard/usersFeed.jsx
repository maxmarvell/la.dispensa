import { useContext, useState } from "react"
import AuthContext from "../../context/auth"
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUserFeed } from "../../api/dashboard";
import { Link } from "react-router-dom";
import { User } from "../../assets/icons/dark";


const take = 10;

const UserRow = ({ user }) => {
  return (
    <div className="flex border rounded-xl">
      <Link
        to={`/profile/${user.id}`}
        className="flex items-center space-x-3"
      >
        <div className="w-14  aspect-square">
          <img
            src={user.image ? user.image : User} alt=""
            className="object-cover h-full w-full rounded-full"
          />
        </div>
        <div>
          <div className="hover:underline">
            {user.username}
          </div>
          <div>
            
          </div>
        </div>
      </Link>
    </div>
  )
}


export const UsersFeed = () => {
  const { user } = useContext(AuthContext);

  const [username, setUsername] = useState("")

  const { data } = useQuery({
    queryKey: ["userFeed", username, user],
    queryFn: () => getUserFeed({ username, take }),
    placeholderData: keepPreviousData
  });

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