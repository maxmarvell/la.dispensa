import { useParams } from "react-router-dom"
import StyledRating from "../styled-components/rating"
import { useContext, useState } from "react";
import AuthContext from "../../context/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, getRating, updateRating } from "../../api/recipe";

const Rating = () => {

  const { recipeId } = useParams();

  const { user: { id: userId } } = useContext(AuthContext);

  const { isLoading, isError, data} = useQuery({
    queryKey: ['review', userId, recipeId],
    queryFn: () => getRating({ recipeId, userId })
  });

  const rating = data?.value;

  const queryClient = useQueryClient();

  const { mutateAsync: createMutation } = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      queryClient.invalidateQueries(['review', userId, recipeId])
    }
  });

  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      queryClient.invalidateQueries(['review', userId, recipeId])
    }
  });

  const rateHandler = async (e) => {
    if (rating) {
      let result = await updateMutation({
        recipeId, userId, input: {
          value: e.target.value
        }
      });
      console.log(result)
    } else {
      createMutation({
        recipeId, input: {
          userId, value: e.target.value
        }
      });
    };
  };


  return (
    <div className="pb-5 space-y-2">
      <div className="text-xl text-center font-bold">
        Want to Leave a Rating?
      </div>
      <div className="flex justify-center">
        <StyledRating
          name="read-only"
          size="large"
          value={rating || null}
          onChange={(e) => rateHandler(e)}
        />
      </div>
    </div>
  )
}

export default Rating