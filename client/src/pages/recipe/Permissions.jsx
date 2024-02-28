import { getConnections, getConnectionsByUserId } from "../../api/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../../context/auth";
import * as dark from "../../assets/icons/dark";
import { addEditor, getEditors, removeEditor } from "../../api/recipe"
import Public from "../../components/recipe/permissions/public";
import Card from "../../components/recipe/permissions/card";

export default function Permissions() {

  const { user: { id: userId } } = useContext(AuthContext);
  const { recipeId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);

  const { isLoading, isError, data: users } = useQuery({
    queryKey: ['connections', userId],
    queryFn: () => getConnections()
  });

  const queryClient = useQueryClient();

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

  const [input, setInput] = useState('')
  const canPermit = input === selectedUser?.username;
  const editor = editors?.map(({ userId }) => userId)?.includes(selectedUser?.id);

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
  };

  useEffect(() => {
    setInput("")
  }, [selectedUser])

  if (isLoading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="flex flex-col divide-y py-5">
      <section className="pb-8">
        <Public />
      </section>
      <section className="space-y-10 py-8">
        <div className="text-lg font-bold text-center underline">Add Editors</div>
        <div className="flex justify-between">
          <div className="w-16 flex justify-center">
            <img src={dark.ExpandLeft} alt="pan left" />
          </div>
          <div className="flex items-center overflow-x-auto">
            {users?.map((el, index) => (
              <Card
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
                user={el}
                key={index}
              />
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
                disabled={!canPermit}
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