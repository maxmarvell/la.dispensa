import { getConnections } from "../../api/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { User } from "../../assets/icons"
import AuthContext from "../../context/auth";
import * as dark from "../../assets/icons/dark";
import { addEditor, getEditors, removeEditor } from "../../api/recipe"

const UserCard = ({ user, setSelectedUser, selectedUser }) => {

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
            User
          )}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="text-center mt-2">{user.username}</div>
      {editor &&
        <div className="text-orange-600 text-xs rounded-full absolute top-2 right-2 py-1 px-2 bg-orange-300">editor</div>
      }
    </div>
  )
}

export default function Permissions() {

  const { user: { id: userId } } = useContext(AuthContext)
  const { recipeId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);

  const { isLoading, isError, data: users, error } = useQuery({
    queryKey: ['connections', userId],
    queryFn: () => getConnections({ userId })
  });

  const queryClient = useQueryClient()

  const { mutateAsync: mutateEditors } = useMutation({
    mutationFn: addEditor,
    onSuccess: () => {
      queryClient.invalidateQueries(['editors', recipeId])
    }
  });

  const { mutateAsync: mutateRemove } = useMutation({
    mutationFn: removeEditor,
    onSuccess: () => {
      queryClient.invalidateQueries(['editors', recipeId])
    }
  });

  const { data: editors } = useQuery({
    queryKey: ['editors', recipeId],
    queryFn: () => getEditors({ recipeId })
  });

  const editor = editors?.map(({ userId }) => userId)?.includes(selectedUser?.id);

  const [input, setInput] = useState('')

  const canPermit = input === selectedUser?.username;


  const handleAddEditor = async () => {
    let result = await mutateEditors({
      recipeId,
      userId: selectedUser.id
    });
    if (result) {
      setSelectedUser(null);
      setInput("");
    };
  };

  const handleRemoveEditor = async () => {
    let result = await mutateRemove({
      recipeId,
      userId: selectedUser.id
    })
    if (result) {
      setSelectedUser(null)
      setInput("")
    }
  }

  if (isLoading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="flex flex-col divide-y py-5">
      <section className="space-y-10 pb-8">
        <div className="text-lg font-bold text-center underline">Make Public</div>
        <div className="flex items-center justify-center divide-x">
          <button className={`p-1 mr-5 ${false ? "bg-orange-300" : "bg-slate-950"}`}>
            <img src={dark.Eye} alt="change public setting" />
          </button>
          <div className="w-80 pl-5 text-justify">
            Make this recipe public allowing all the recipe to appear to all users in their feed
          </div>
        </div>
      </section>
      <section className="space-y-10 py-8">
        <div className="text-lg font-bold text-center underline">Add Editors</div>
        <div className="flex space-x-5">
          <div className="w-16 flex justify-center">
            <img src={dark.ExpandLeft} alt="pan left" />
          </div>
          <div className="flex items-center overflow-x-auto">
            {users?.map(({ connectedWith: user }, index) => (
              <UserCard
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
                user={user}
                key={index} />
            ))}
          </div>
          <div className="w-16 flex justify-center">
            <img src={dark.ExpandRight} alt="pan right" />
          </div>
        </div>
        {selectedUser ? (
          <div>
            {editor ? (
              <div className="text-center">
                Would you like to remove <span className="font-bold">{selectedUser.username}</span>'s access to this recipe in the test kitchen?
              </div>
            ) : (
              <div className="text-center">
                Would you like <span className="font-bold">{selectedUser.username}</span> to be able to work on this recipe in
                the test kitchen?
              </div>
            )}
            <div className="text-center">
              Type their username in the textbox below
            </div>
            <div className="flex justify-center">
              <input
                type="text"
                className="border-0 border-b-2 border-slate-950 text-center
                           focus:outline-none focus:border-orange-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedUser.username}
              />
            </div>
            <div className="flex justify-center mt-5">
              <button
                className="px-2 py-1 bg-slate-950 text-white"
                onClick={editor ? handleRemoveEditor : handleAddEditor}
                disabled={canPermit}
              >
                Allow
              </button>
            </div>
          </ div>
        ) : (
          null
        )
        }
      </section >
    </div >
  )
}