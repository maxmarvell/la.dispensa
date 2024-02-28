import { useQuery } from "@tanstack/react-query";
import { getRecipeNotifications } from "../../../api/dashboard";
import { Link } from "react-router-dom";


export const RecipeNotifications = () => {

  const { data, isLoading } = useQuery({
    queryKey: ["recipe-notifications"],
    queryFn: () => getRecipeNotifications()
  });

  if (isLoading) {
    return (
      <>
        {Array.from(Array(8).keys()).map(el => (
          <div
            key={el}
            className="h-4 mb-1 mt-1 rounded-full w-full bg-slate-300 animate-pulse first:pt-0 last:mb-0"
          />
        ))}
      </>
    );
  };

  if (data?.length === 0) {
    return (
      <div className="text-center text-wrap text-xs">
        You have to add some friends to get active updates of their creations
      </div>
    );
  };

  return (
    <>
      {data?.map((recipe, index) => {
        let { createdOn, updatedAt, author: { username }, authorId, title, id } = recipe;
        return (
          <div className="text-xs line-clamp-1 mb-1 pt-1 first:pt-0 last:mb-0" key={index}>
            <Link className="hover:underline" to={`/profile/${authorId}`}>{username} </Link>
            {(createdOn === updatedAt) ? "created" : "edited"}
            <Link className="hover:underline" to={`/recipes/${id}`}> {title}</Link>
          </div>
        )
      })}
    </>
  );
};