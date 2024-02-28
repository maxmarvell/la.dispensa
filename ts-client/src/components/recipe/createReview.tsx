import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createReview, getReview, updateReview } from "../../api/recipe"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../../context/auth"
import { AuthContextType } from "../../@types/context"

const CreateReview = () => {

  const { recipeId } = useParams();

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;


  const { data: review } = useQuery({
    queryKey: ['review', recipeId, userId],
    queryFn: () => getReview({ recipeId, userId })
  })

  const [text, setText] = useState(review?.text || "");

  useEffect(() => (
    setText(review?.text || "")
  ), [review]);


  const queryClient = useQueryClient();

  const { mutateAsync: createMutate } = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', recipeId, userId]})
    }
  })

  const { mutateAsync: updateMutate } = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', recipeId, userId]})
    }
  });

  const handleSubmit = async () => {
    if (review?.text) {
      await updateMutate({
        recipeId, userId, input: {
          text
        }
      });
    } else {
      await createMutate({
        recipeId, input: {
          userId, text
        }
      });
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
}

export default CreateReview