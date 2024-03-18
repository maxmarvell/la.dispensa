import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// services
import { useInstruction } from "@/pages/recipe/hooks/useInstruction";
import { IconDeviceFloppy,} from "@tabler/icons-react";

// types
import { BaseRecipeInstructionType } from "@/types/recipe";

import { InstructionInput } from "@/components/preparations/input";
import { TimeAndTemperatureType } from "@/types/instruction";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export const CreatePreparations = () => {

  // retrieve recipeId from params
  const { recipeId } = useParams();

  if (!recipeId) throw new Error("id of recipe not found!");

  // get the instructions and components for this recipe id
  const { getInstructions: { data }, createInstructions } = useInstruction({ recipeId });
  const instructions = data?.instructions;

  // form fields for new instructions
  const [newInstructions, setNewInstructions] = useState<BaseRecipeInstructionType[]>([]);

  // If no instructions have been added already default to one empty field
  useEffect(() => {
    setNewInstructions((instructions?.length === 0) ? [{
      step: 1,
      description: "",
      recipeId,
    }] : []);
  }, [instructions]);

  const handleAddField = () => {
    let len = instructions?.length as number;
    setNewInstructions(prev => [...prev, {
      step: newInstructions?.length + len + 1,
      description: "",
      recipeId
    }]);
  };

  // set description
  const setDescription = ({ description, step }: { description: string, step: number }) => setNewInstructions(prev => (
    prev.map(el => {
      if (el.step === step) {
        return { ...el, description }
      } else {
        return el
      }
    })
  ));

  // set time and temperature
  const setTimeAndTemperature = ({ timeAndTemperature, step }: { timeAndTemperature?: TimeAndTemperatureType, step: number }) => setNewInstructions(prev => (
    prev.map(el => {
      if (el.step === step) {
        return { ...el, timeAndTemperature }
      } else {
        return el
      }
    })
  ));

  const handleRemoveInstruction = ({ step }: { step: number }) => setNewInstructions(prev => (
    prev.filter(el => el.step !== step).map(el => {
      if (el.step > step) {
        return { ...el, step: el.step - 1 }
      } else {
        return el
      }
    })
  ))

  const handleCreate = async () => {
    await createInstructions.mutateAsync({ input: newInstructions });
  };

  return (
    <>
      {newInstructions?.map((el) => (
        <InstructionInput
          key={el.step}
          instruction={el}
          descriptionHandler={setDescription}
          timeAndTemperatureHandler={setTimeAndTemperature}
          removeInstruction={handleRemoveInstruction}
        />
      ))
      }
      <div className="flex border-none justify-center space-x-5 pt-2">
        <Button
          onClick={handleAddField}
          className="hover:bg-orange-300 hover:text-slate-950"
        >
          <IconPlus className="mr-3" /> Add Another
        </Button>
        <Button
          onClick={handleCreate}
          className="hover:bg-orange-300 hover:text-slate-950"
        >
          <IconDeviceFloppy className="mr-3" /> Save All
        </Button>
      </div>
    </>
  )
};