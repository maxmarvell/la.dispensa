import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

// services
import { useIterationInstruction } from "@/pages/test-kitchen/hooks/useIterationInstructions";
import SocketContext from "@/services/contexts/socketContext";
import AuthContext from "@/services/contexts/authContext";

// types
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { NewIterationInstructionFieldProps, NewIterationInstructionsProps } from "@/pages/test-kitchen/models";
import { BaseInstructionType } from "@/types/instruction";

// assets
import { IconCircleMinus, IconCirclePlus, IconDeviceFloppy, IconFlame } from "@tabler/icons-react";

const CREATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_CREATE_INSTRUCTION_CHANNEL

const Field = ({ instruction, setNewInstructions }: NewIterationInstructionFieldProps) => {

  const { timeAndTemperature, step, description } = instruction;

  const handleSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = e;
    const { value } = target;
    setNewInstructions((prev) => (
      prev.map((el) => {
        if (el.step === step) {
          return { ...el, description: value }
        } else {
          return el
        }
      })
    ));
    adjustTextareaHeight(target);
  };

  // set hour field
  const handleSetHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hours = e.target.valueAsNumber;
    setNewInstructions(prev => prev.map(({ timeAndTemperature, ...rest }) => {
      if (rest.step === instruction.step) {
        if (!timeAndTemperature) return { ...rest }
        if (hours !== 0) {
          timeAndTemperature.hours = hours;
        } else {
          delete timeAndTemperature.hours
        };
        return { ...rest, timeAndTemperature: { ...timeAndTemperature } }
      } else {
        return { timeAndTemperature, ...rest }
      };
    })
    );
  };

  // set minute field
  const handleSetMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    let minutes = e.target.valueAsNumber;
    setNewInstructions(prev => prev.map(({ timeAndTemperature, ...rest }) => {
      if (rest.step === instruction.step) {
        if (!timeAndTemperature) return { ...rest }
        if (minutes !== 0) {
          timeAndTemperature.minutes = minutes;
        } else {
          delete timeAndTemperature.minutes
        };
        return { ...rest, timeAndTemperature: { ...timeAndTemperature } }
      } else {
        return { timeAndTemperature, ...rest }
      };
    })
    );
  };

  // set temperature field
  const handleSetTemperature = (e: React.ChangeEvent<HTMLInputElement>) => {
    let temperature = e.target.valueAsNumber;
    setNewInstructions(prev => prev.map(({ timeAndTemperature, ...rest }) => {
      if (rest.step === instruction.step) {
        if (!timeAndTemperature) return { ...rest }
        if (temperature !== 0) {
          timeAndTemperature.temperature = temperature;
        } else {
          delete timeAndTemperature.temperature
        };
        return { ...rest, timeAndTemperature: { ...timeAndTemperature } }
      } else {
        return { timeAndTemperature, ...rest }
      };
    })
    );
  };

  const toggleTimeAndTemperatureField = () => {
    setNewInstructions((prev) => (
      prev.map(({ timeAndTemperature, ...rest }) => {
        if (rest.step === step) {
          return timeAndTemperature ? rest : { ...rest, timeAndTemperature: { unit: "C" } }
        }
        else {
          return { timeAndTemperature, ...rest }
        }
      })
    ))
  };

  const TimeTemperatureButton = () => {
    const [_, setHovered] = useState(false);
    if (timeAndTemperature) {
      return (
        <button
          onClick={toggleTimeAndTemperatureField}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="border-2 border-orange-300 my-1 bg-orange-300"
        >
          <IconFlame />
        </button>
      );
    } else {
      return (
        <button
          onClick={toggleTimeAndTemperatureField}
          className="bg-slate-950 border-2 border-slate-950 my-1 hover:bg-orange-300"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconFlame />
        </button>
      );
    };
  };

  const removeField = () => {
    setNewInstructions(prev => {
      let newArr = [...prev];
      return newArr.filter(el => el.step !== step).map(({ step: s, ...rest }) => (
        s > step ? ({ ...rest, step: s - 1 }) : ({ ...rest, step: s })
      ));
    })
  };

  const RemoveButton = () => {
    const [_, setHovered] = useState(false);
    return (
      <button
        onClick={removeField}
        className="border-2 border-slate-950 my-1 bg-slate-950 hover:bg-orange-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <IconCircleMinus />
      </button>
    );
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="flex py-2 first:pt-0">
      <div
        className="grow font-bold justify-between mb-1 border-l-4
                   pl-2 border-transparent focus-within:border-orange-300"
      >
        <div className="flex grow items-center justify-between">
          <div className="font-bold text-sm">
            Step {step}
          </div>
          <div className="text-xs space-x-2 flex">
            {timeAndTemperature ? (
              <>
                <div className="my-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
                  <input
                    type="number"
                    value={timeAndTemperature.hours ? timeAndTemperature.hours : ""}
                    className="bg-transparent border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={handleSetHours}
                  />
                  <span>hr</span>
                </div>
                <div className="my-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
                  <input
                    type="number"
                    value={timeAndTemperature.minutes ? timeAndTemperature.minutes : ""}
                    className="bg-transparent border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={handleSetMinutes}
                  />
                  <span>mins</span>
                </div>
                <div className="my-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
                  <input
                    type="number"
                    value={timeAndTemperature.temperature ? timeAndTemperature.temperature : ""}
                    onChange={handleSetTemperature}
                    className=" bg-transparent border-0 px-0 py-1 pr-1 w-14 focus:outline-none"
                  />
                  <span>{timeAndTemperature.unit}</span>
                </div>
                <TimeTemperatureButton />
                <RemoveButton />
              </>
            ) : (
              <>
                <TimeTemperatureButton />
                <RemoveButton />
              </>
            )}
          </div>
        </div>
        <div
          className="grow border-0 mb-2 text-xs
                     px-0 border-transparent"
        >
          <label htmlFor={`update-instruction-${instruction.step}`} className="hidden">new instruction input</label>
          <textarea
            value={description}
            id={`input-new-instruction-${instruction.step}`}
            onChange={(e) => handleSetDescription(e)}
            className="bg-transparent w-full border-none focus:outline-none overflow-y-hidden resize-none px-0"
            placeholder="Write here..."
          />
        </div>
      </div>
    </div>
  );
};


export const CreatePreparations = ({ instructions, iterationId, setNodes }: NewIterationInstructionsProps) => {

  // form fields for new instructions
  const [newInstructions, setNewInstructions] = useState([{} as BaseInstructionType]);

  const { socket } = useContext(SocketContext) as SocketContextType;

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const { recipeId } = useParams();

  // If no instructions have been added already default to one empty field
  useEffect(() => {
    setNewInstructions((instructions?.length === 0) ? [{
      step: 1,
      description: ""
    }] : []);
  }, [instructions]);

  // Add a field to the list of preparations
  const handleAddField = () => {
    setNewInstructions((prev) => [...prev, {
      step: newInstructions?.length + instructions?.length + 1,
      description: ""
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
      {newInstructions?.map((el) => (
        <Field
          key={el.step}
          instruction={el}
          setNewInstructions={setNewInstructions}
        />
      ))
      }
      <div className="flex border-none justify-center space-x-5 pt-2">
        <button
          onClick={handleAddField}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <IconCirclePlus />
        </button>
        <button
          onClick={handleCreate}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <IconDeviceFloppy />
        </button>
      </div>
    </>
  )

}