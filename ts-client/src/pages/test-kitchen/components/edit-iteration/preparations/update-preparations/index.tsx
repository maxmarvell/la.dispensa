import { useContext } from "react";
import { useParams } from "react-router-dom";

// services
import AuthContext from "@/services/contexts/authContext";
import SocketContext from "@/services/contexts/socketContext";

// components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// types
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { IterationInstructionProps, UpdateIterationInstructionProps } from "@/pages/test-kitchen/models";
import { TimeAndTemperatureType } from "@/types/instruction";
import { useIterationInstruction } from "@/pages/test-kitchen/hooks/useIterationInstructions";
import { InstructionInput } from "@/components/preparations/input";
import { RemoveIterationInstructionProps } from "@/pages/test-kitchen/models";

// channels
const UPDATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_UPDATE_INSTRUCTION_CHANNEL
const DELETE_INSTRUCTION_CHANNEL = import.meta.env.VITE_DELETE_INSTRUCTION_CHANNEL


export const UpdatePreparations = ({ instructions, iterationId, setNodes }: IterationInstructionProps) => {

  const { recipeId } = useParams();

  // context
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  // socket
  const { socket } = useContext(SocketContext) as SocketContextType;

  // handle set description
  const setDescription = ({ description, step }: { description: string, step: number }) => setNodes(prev => prev.map(({ data, ...rest }) => {
    if (data.id === iterationId) {
      return {
        ...rest,
        data: {
          ...data,
          instructions: data.instructions.map(el => (
            el.step === step ? { ...el, description } : el
          ))
        }
      };
    } else {
      return { data, ...rest };
    };
  }));

  // handle set temperature field
  const setTimeAndTemperature = ({ timeAndTemperature, step }: { timeAndTemperature?: TimeAndTemperatureType, step: number }) => setNodes(prev => prev.map(({ data, ...rest }) => {
    if (data.id === iterationId) {
      return {
        ...rest,
        data: {
          ...data,
          instructions: data.instructions.map(el => (
            el.step === step ? {
              ...el, timeAndTemperature
            } : el
          ))
        }
      };
    } else {
      return { data, ...rest };
    };
  }));

  // mutation functions
  const { removeInstruction, updateInstruction } = useIterationInstruction({ iterationId });

  const handleRemoveInstruction = async ({ step }: RemoveIterationInstructionProps) => {

    // make delete request
    await removeInstruction({ step });

    // set global
    setNodes(prev => prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        let instructions = data.instructions.filter(el => el.step !== step)
        return {
          ...rest, data: {
            ...data, instructions: instructions.map(el => el.step > step ? {
              ...el,
              step: el.step - 1
            } : el)
          }
        };
      } else {
        return { data, ...rest };
      }
    }));

    // emit the change
    socket?.emit(DELETE_INSTRUCTION_CHANNEL, {
      iterationId,
      step,
      recipeId,
      userId,
    })
  };

  const handleUpdateInstruction = async ({ step, input }: UpdateIterationInstructionProps) => {

    // make update request
    await updateInstruction({ step, input });

    // set global
    setNodes(prev => prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        return {
          ...rest, data: {
            ...data, instructions: instructions.map(el => el.step === step ? {
              ...input,
              iterationId,
              step
            } : el)
          }
        };
      } else {
        return { data, ...rest };
      }
    }));

    // emit the change
    socket?.emit(UPDATE_INSTRUCTION_CHANNEL, {
      iterationId,
      instruction: {
        ...input,
        iterationId,
        step
      },
      recipeId,
      userId,
    })
  };

  return (
    <>
      {instructions?.map(instruction => (
        <Accordion type="single" key={instruction.step} collapsible>
          <AccordionItem value={`item-${instruction.step}`} className="px-1">
            <AccordionTrigger>Step {instruction.step}</AccordionTrigger>
            <AccordionContent>
              <InstructionInput
                key={instruction.step}
                instruction={instruction}
                descriptionHandler={setDescription}
                timeAndTemperatureHandler={setTimeAndTemperature}
                removeInstruction={handleRemoveInstruction}
                updateInstruction={handleUpdateInstruction}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
};