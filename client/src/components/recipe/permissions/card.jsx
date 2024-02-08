import { useQuery, } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import * as dark from "../../../assets/icons/dark";
import { getEditors,  } from "../../../api/recipe"


const Card = ({ user, setSelectedUser, selectedUser }) => {

  const { recipeId } = useParams();

  const { data: editors } = useQuery({
    queryKey: ['editors', recipeId],
    queryFn: () => getEditors({ recipeId })
  })

  const editor = editors?.map(({ userId }) => userId)?.includes(user.id);

  const selected = user === selectedUser;

  return (
    <div className="flex flex-col items-center px-5 first:pl-1 last:pr-1 py-1 relative">
      <div
        className={`size-32 items-center flex cursor-pointer rounded-full overflow-hidden
                    ${selected && "ring-4 ring-orange-300"}`}
        onClick={() => setSelectedUser(user)}
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
      {editor &&
        <div className="text-orange-600 text-xs rounded-full absolute top-2 right-2 py-1 px-2 bg-orange-300">editor</div>
      }
    </div>
  );
};

export default Card;