import { useContext, useState } from "react"
import { useParams } from "react-router-dom"

import AuthContext from "@/services/contexts/authContext"

// types
import { AuthContextType } from "@/services/contexts/models"
import { useReview } from "@/pages/recipe/hooks/useReview"

export const CreateReview = () => {

  // get recipe id
  const { recipeId } = useParams();

  // get user id
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  // get hook
  const { getReview: { data }, createReview, updateReview } = useReview({ recipeId, userId });

  // set state
  const [text, setText] = useState(data?.text || "");

  const handleSubmit = async () => {
    if (data?.text) {
      await updateReview.mutateAsync({ text });
    } else {
      await createReview.mutateAsync({ text });
    };
  }

  return (
    <div className="pt-5 space-y-2">
      <div className="text-xl text-center font-bold">
        Want to leave a Review?
      </div>
      <div className="flex items-center space-x-5">
        <textarea
          className="resize-none w-2/3 border rounded
                   focus:border-orange-300 focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start Writing Here"
        />
        <button
          className={`bg-slate-950 text-white p-1 ${text === "" && "bg-slate-400"}`}
          disabled={text === ""}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
};