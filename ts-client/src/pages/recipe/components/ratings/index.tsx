import { useParams } from "react-router-dom"
import { useContext } from "react";

// services
import AuthContext from "@/services/contexts/authContext";


import StyledRating from "@/components/styled-components/rating";

// types
import { AuthContextType } from "@/services/contexts/models";
import { useRating } from "../../hooks/useRating";


export const Rating = () => {

  const { recipeId } = useParams();

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const { getRating: { data }, createRating, updateRating } = useRating({ recipeId, userId });

  const rating = data?.value;

  const rateHandler = async (e: any) => {
    if (rating) {
      await updateRating.mutateAsync({ value: e.target.value });
    } else {
      await createRating.mutateAsync({ value: e.target.value });
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
          onChange={rateHandler}
        />
      </div>
    </div>
  )
};