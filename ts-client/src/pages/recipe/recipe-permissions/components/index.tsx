import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

// components
import { Public } from "./set-public";
import { Card } from "./user-card";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

// services
import AuthContext from "@/services/contexts/authContext";
import { useEditor } from "../hooks/useEditor";

// types
import { AuthContextType } from "@/services/contexts/models";
import { BaseUserType } from "@/types/user";
import { useConnections } from "@/services/hooks/connections/useConnections";

export const Permissions = () => {

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const { recipeId } = useParams();
  const [selectedUser, setSelectedUser] = useState<BaseUserType | null>(null);

  const { getConnections: { data: users, isLoading } } = useConnections({ userId });

  const { addEditor, removeEditor, getEditors: { data } } = useEditor({ recipeId });

  const [input, setInput] = useState('')
  const canPermit = input === selectedUser?.username;
  const editor = data?.map(({ id }) => id)?.includes(selectedUser?.id || "");

  const handleAddEditor = async () => {
    if (!selectedUser) return;
    let result = await addEditor.mutateAsync({ userId: selectedUser.id });
    if (result) {
      setSelectedUser(null);
      setInput("");
    };
  };

  const handleRemoveEditor = async () => {
    if (!selectedUser) return;
    let result = await removeEditor.mutateAsync({ userId: selectedUser.id })
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
            <IconArrowNarrowLeft />
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
            <IconArrowNarrowRight />
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