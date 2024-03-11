import { useNavigate } from "react-router-dom";
import { useContext } from "react";

// services
import AuthContext from "@/services/contexts/authContext";

// types
import { AuthContextType } from "@/services/contexts/models";
import { RecipeSearchComponentProps } from "../../models";
import { useRecipe } from "@/services/hooks/recipe/useRecipe";
import { IconCirclePlus, IconSearch } from "@tabler/icons-react";

export const RecipeSearch = ({ title, setTitle }: RecipeSearchComponentProps) => {

  const { user } = useContext(AuthContext) as AuthContextType;

  const { createRecipe } = useRecipe({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const navigate = useNavigate();

  const handleCreate = async () => {
    let data = await createRecipe.mutateAsync({ title });
    navigate(`/recipes/${data.id}`);
  };

  return (
    <div
      className="w-1/2 min-w-12 flex justify-between border-0 pb-1
                 border-b-2 border-slate-950 focus-within:border-orange-300"
    >
      <IconSearch />
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
          <IconCirclePlus />
        </button>
      ) : (
        null
      )}
    </div>
  );
};

export default RecipeSearch;