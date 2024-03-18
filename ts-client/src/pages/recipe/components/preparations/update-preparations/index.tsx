import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// components
import { InstructionInput } from "@/components/preparations/input";

// services
import { useInstruction } from "@/pages/recipe/hooks/useInstruction";

// types
import {  UpdateInstructionProps } from "@/pages/recipe/models";
import { TimeAndTemperatureType } from "@/types/instruction";
import { BaseRecipeInstructionType } from "@/types/recipe";


export const UpdatePreparations = () => {

  const { recipeId } = useParams();

  // Get the instructions and components for this recipe id
  const { getInstructions: { data, isFetching } } = useInstruction({ recipeId });

  const { removeInstruction, updateInstruction } = useInstruction({ recipeId });

  const [instructions, setInstructions] = useState<BaseRecipeInstructionType[]>(data?.instructions || []);

  useEffect(() => setInstructions(data?.instructions || []), [isFetching])

  // handle set description
  const setDescription = ({ description, step }: { description: string, step: number }) => setInstructions(prev => (
    prev.map(el => (
      el.step === step ? { ...el, description } : el
    ))
  ));

  // handle set temperature field
  const setTimeAndTemperature = ({ timeAndTemperature, step }: { timeAndTemperature?: TimeAndTemperatureType, step: number }) => setInstructions(prev => (
    prev.map(el => (
      el.step === step ? {
        ...el, timeAndTemperature
      } : el
    ))
  ));

  const handleRemoveInstruction = async ({ step }: { step: number }) => {

    await removeInstruction.mutateAsync({ step });

    setInstructions(prev => prev.filter(
      el => step !== el.step
    ).map(el => {
      if (el.step > step) {
        return { ...el, step: el.step - 1 }
      } else return el
    }))
  };

  const handleUpdateInstruction = async ({ step, input }: UpdateInstructionProps) => {

    await updateInstruction.mutateAsync({ step, input });

    setInstructions(prev => prev.map(
      el => el.step === step ? { ...el, ...input } : el
    ));
  };

  return (
    <>
      {instructions?.map(instruction => (
        <InstructionInput
          key={instruction.step}
          instruction={instruction}
          descriptionHandler={setDescription}
          timeAndTemperatureHandler={setTimeAndTemperature}
          removeInstruction={handleRemoveInstruction}
          updateInstruction={handleUpdateInstruction}
        />
      ))}
    </>
  );
};