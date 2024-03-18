import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// APIs
import { getInstructions } from "../../../api/instructions";
import { getRecipe } from "../../../api/recipe";

// Components
import { CreatePreparations } from "./createPreparations";
import { UpdatePreparations } from "./updatePreparations";

// Context
import AuthContext from "../../../context/auth";


const Field = ({ instruction }) => {
  const { step, timeAndTemperature } = instruction;
  return (
    <div className="border-l-4 border-l-transparent pl-2 py-2">
      <div className="text-lg font-bold flex grow justify-between">
        <div>
          Step {step}
        </div>
        <div className="text-xs space-x-2 flex min-w-fit">
          <div className="my-auto flex space-x-2 text-xs">
            {timeAndTemperature?.hours ? (
              <div>{timeAndTemperature.hours} hr(s)</div>
            ) : (
              null
            )}
            {timeAndTemperature?.minutes ? (
              <div>{timeAndTemperature.minutes} min(s)</div>
            ) : (
              null
            )}
            <span>{timeAndTemperature?.temperature} {timeAndTemperature?.unit}</span>
          </div>
        </div>
      </div>
      <div className="text-sm py-2">
        {instruction.description}
      </div>
    </div>
  );
};


const Preparations = () => {

  // Extract recipeId and current user
  const { recipeId } = useParams();
  const { user } = useContext(AuthContext);

  // Retrieve the recipe and extract the author id
  const { data: recipe } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });
  const authorId = recipe?.authorId;

  // Get the instructions and components for this recipe id
  const { data, isLoading, isError } = useQuery({
    queryKey: ['instructions', recipeId],
    queryFn: () => getInstructions({ recipeId })
  });

  const instructions = data?.instructions;
  const components = data?.components;

  if (authorId !== user?.id) {
    return (
      <div className="divide-y text-sm">
        {instructions?.map((instruction, index) => (
          <Field
            key={index}
            instruction={instruction}
          />
        ))}
        {components?.map(({ instructions, title }, index) => (
          <div className="pb-1 pt-1 last:pb-0" key={index}>
            <div className="italic text-lg">For the {title}</div>
            {instructions.map((instruction, index) => (
              <Field
                key={index}
                instruction={instruction}
              />
            ))}
          </div >
        ))}
      </div>
    );
  };

  return (
    <div className="divide-y text-sm">
      <div>
        <UpdatePreparations />
        <CreatePreparations />
      </div>
      {components?.map(({ instructions, title }, index) => (
        <div className="pb-1 pt-1 last:pb-0" key={index}>
          <div className="italic text-lg">For the {title}</div>
          {instructions.map((instruction, index) => (
            <Field
              key={index}
              instruction={instruction}
            />
          ))}
        </div >
      ))}
    </div>
  );
};

export default Preparations;