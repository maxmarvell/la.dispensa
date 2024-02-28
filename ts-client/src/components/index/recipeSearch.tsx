import { createRecipe } from "../../api/recipe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as dark from "../../assets/icons/dark"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/auth";
import { AuthContextType } from "../../@types/context";
import { RecipeSearchPropsType } from "../../@types/recipe";

const RecipeSearch = ({ title, setTitle } : RecipeSearchPropsType) => {

  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext) as AuthContextType;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', title] })
    }
  });

  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const navigate = useNavigate();

  const handleCreate = async () => {
    let data = await mutateAsync({ title });
    navigate(`/recipes/${data.id}`);
  };

  return (
    <div
      className="w-1/2 min-w-12 flex justify-between border-0 pb-1
                 border-b-2 border-slate-950 focus-within:border-orange-300"
    >
      <img src={dark.Search} alt="search" />
      <input
        type="input"
        onChange={handleInputChange}
        value={title}
        placeholder="Search the title of the recipe"
        className="border-none w-5/6 mx-2 focus:outline-none"
      />
      <div className="sr-only" aria-live="polite"></div>
      {user ? (
        <button onClick={handleCreate} className="min-w-fit">
          <img
            src={isPending ? dark.Refresh : dark.Add} alt="add"
            className={isPending ? "animate-spin" : ""}
          />
        </button>
      ) : (
        null
      )}
    </div>
  );
};

export default RecipeSearch;