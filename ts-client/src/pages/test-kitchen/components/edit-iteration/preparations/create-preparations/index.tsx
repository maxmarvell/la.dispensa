import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InstructionInput } from "@/components/preparations/input";

// services
import { useIterationInstruction } from "@/pages/test-kitchen/hooks/useIterationInstructions";
import SocketContext from "@/services/contexts/socketContext";
import AuthContext from "@/services/contexts/authContext";

// types
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { NewIterationInstructionsProps } from "@/pages/test-kitchen/models";
import { NewInstructionInputType } from "@/types/instruction";
import { TimeAndTemperatureType } from "@/types/instruction";

// assets
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";

const CREATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_CREATE_INSTRUCTION_CHANNEL


export const CreatePreparations = ({ instructions, iterationId, setNodes }: NewIterationInstructionsProps) => {

  // form fields for new instructions
  const [newInstructions, setNewInstructions] = useState<NewInstructionInputType[]>([]);

  const { socket } = useContext(SocketContext) as SocketContextType;

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const { recipeId } = useParams();

  // If no instructions have been added already default to one empty field
  useEffect(() => {
    setNewInstructions((instructions?.length === 0) ? [{
      step: 1,
      description: "",
      id: crypto.randomUUID()
    }] : []);
  }, [instructions]);

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

  // add a field to the list of preparations
  const handleAddField = () => {
    setNewInstructions((prev) => [...prev, {
      step: newInstructions?.length + instructions?.length + 1,
      description: "",
      id: crypto.randomUUID()
    }]);
  };

  // Add mutation invalidates get instructions
  const { createInstructions } = useIterationInstruction({ iterationId })

  const handleCreate = async () => {
    let results = await createInstructions({ input: newInstructions });
    if (results) {

      // Reset the add fields
      setNewInstructions([]);

      // Update the global node state
      setNodes((prev) => (prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { instructions } = data;
          return { ...rest, data: { ...data, instructions: [...instructions, ...results] } };
        } else {
          return { ...rest, data };
        }
      })));

      // emit the change
      socket?.emit(CREATE_INSTRUCTION_CHANNEL, {
        recipeId,
        userId,
        newInstructions: results,
        iterationId
      });
    }
  };

  return (
    <>
      {newInstructions?.map(el => (
        <Accordion type="single" key={el.step} collapsible>
          <AccordionItem value={`item-${el.step}`} className="px-1">
            <AccordionTrigger>Step {el.step}</AccordionTrigger>
            <AccordionContent>
              <InstructionInput
                key={el.step}
                instruction={el}
                descriptionHandler={setDescription}
                timeAndTemperatureHandler={setTimeAndTemperature}
                removeInstruction={handleRemoveInstruction}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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

}