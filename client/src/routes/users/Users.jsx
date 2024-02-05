import { useContext, useState } from "react";
import AuthContext from "../../context/auth";
import { User, UserAdd, ArrowRight } from "../../assets/icons";
import { NavLink, Outlet } from "react-router-dom";
import { getMany as getUsers } from "../../api/user";
import { useQuery } from "@tanstack/react-query";

const UserCard = ({ user }) => {

  const { user: currentUser } = useContext(AuthContext);

  const [connectionType, setConnectionType] = useState(user.connectedWith.find(
    (el) => el.connectedById === currentUser?.id
  ));

  function clickHandler() {
    connectionType ? (
      removeConnection({
        connectedById: currentUser.id,
        connectedWithId: user.id,
        handler: setConnectionType
      })
    ) : (
      createConnection({
        connectedById: currentUser.id,
        connectedWithId: user.id,
        handler: setConnectionType
      })
    );
  };

  return (
    <div className="h-fit w-32 space-y-3 flex flex-col justify-start p-3 rounded-lg border">
      <div
        className="aspect-square items-center flex overflow-hidden"
      >
        <img src={user.image ? user.image : User}
          className="object-cover rounded-full h-full w-full"
        />
      </div>
      <div className="text-center">{user.username}</div>
      <div className="flex justify-center space-x-4">
        {currentUser ? (
          <button type="button" onClick={() => clickHandler()}
            className={`${connectionType && (connectionType.accepted ? "ring ring-green-300" : "ring ring-slate-400")} border rounded-full p-1`}
          >
            <img src={UserAdd} alt="add-user" />
          </button>
        ) : null}
        <NavLink to={`/users/${user.id}`}
          className={({ isActive, isPending }) =>
            isActive
              ? "ring ring-blue-500 border rounded-full p-1"
              : isPending
                ? "ring ring-grey-600 border rounded-full p-1"
                : "border rounded-full p-1"
          }
        >
          <img src={ArrowRight} alt="go" />
        </NavLink>
      </div>
    </div>
  )
}


export default function Users() {

  const { user: {id: userId} } = useContext(AuthContext);

  const { isLoading, isError, data: users, error } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUsers({ userId })
  });

  console.log(users)

  if (isLoading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="text-3xl font-bold uppercase">users</div>
      <div className="flex-wrap flex gap-5">
        {
          users?.map((user, index) => (
            <UserCard
              user={user}
              key={index}
            />
          ))
        }
      </div>
      <div className="flex-grow border rounded-xl p-8">
        <Outlet />
      </div>
    </div>
  )
}