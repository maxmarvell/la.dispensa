import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get as getInstructions } from "../../../api/instructions";
import { getComponents, getRecipe } from "../../../api/recipe";
import UpdateField from "./updateField";
import Create from "./create";


const Preparations = () => {

  // 
  const { recipeId } = useParams();

  const { data: recipe } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  // Get the instructions for this recipe id
  const { isPending, isError, data: instructions, error } = useQuery({
    queryKey: ['instructions', recipeId],
    queryFn: () => getInstructions({ recipeId })
  });

  const { data: components } = useQuery({
    queryKey: ['components', recipeId],
    queryFn: () => getComponents({ recipeId })
  })

  const [selected, setSelected] = useState(null)

  if (selected !== null) {

    let { component: { instructions } } = components[selected];

    return (
      <>
        <div className="flex justify-center divide-x my-5">
          <button
            className="pr-3 hover:underline"
            onClick={() => setSelected(null)}
          >
            {recipe?.title}
          </button>
          {components.map(({ component }, index) => (
            <button key={index}
              className="px-3 last:pr-0 hover:underline"
              onClick={() => setSelected(index)}
            >
              {component.title}
            </button>
          ))}
        </div>
        {instructions?.map((instruction, index) => (
          <UpdateField
            key={index}
            instruction={instruction}
          />
        ))}
      </ >
    )
  }

  return (
    <>
      {components?.length ? (
        <div className="flex justify-center divide-x my-5">
          <button
            className="pr-3 hover:underline"
            onClick={() => setSelected(null)}
          >
            {recipe?.title}
          </button>
          {components.map(({ component }, index) => (
            <button key={index}
              className="px-3 last:pr-0 hover:underline"
              onClick={() => setSelected(index)}
            >
              {component.title}
            </button>
          ))}
        </div>
      ) : (
        null
      )}
      {instructions?.map((instruction, index) => (
        <UpdateField
          key={index}
          instruction={instruction}
        />
      ))}
      <Create instructions={instructions} />
    </>
  )
}

export default Preparations;