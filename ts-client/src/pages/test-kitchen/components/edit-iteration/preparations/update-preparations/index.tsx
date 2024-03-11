import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// services
import AuthContext from "@/services/contexts/authContext";
import SocketContext from "@/services/contexts/socketContext";

// types
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { IterationInstructionProps, IterationInstructionFieldProps } from "@/pages/test-kitchen/models";
import { IconCircleMinus, IconDeviceFloppy, IconEdit, IconFlame } from "@tabler/icons-react";
import { BaseInstructionType } from "@/types/instruction";
import { useIterationInstruction } from "@/pages/test-kitchen/hooks/useIterationInstructions";

// channels
const UPDATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_UPDATE_INSTRUCTION_CHANNEL
const DELETE_INSTRUCTION_CHANNEL = import.meta.env.VITE_DELETE_INSTRUCTION_CHANNEL

const UpdateField = ({ instruction, setNodes }: IterationInstructionFieldProps) => {

  // Extract relavent information with instruction
  const { step, ...data } = instruction;
  const { iterationId, timeAndTemperature, ...rest } = data;

  const { recipeId } = useParams();

  // context
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  // socket
  const { socket } = useContext(SocketContext) as SocketContextType;

  // Set the instruction input field
  const [instructionInput, setInput] = useState<Omit<BaseInstructionType, 'step'>>(timeAndTemperature ? data : rest);
  useEffect(() => (
    setInput(timeAndTemperature ? data : rest)
  ), [instruction]);

  // State to toggle whether editing or not
  const [editing, setEditing] = useState(false);

  // Handle click of the edit button
  const handleClickEdit = () => {
    setEditing(!editing);
    window.setTimeout(() => {
      if (!editing && ref?.current) {
        ref.current.focus();
        let inputLength = ref.current.value.length;
        ref.current.setSelectionRange(inputLength, inputLength);
      }
    }, 0);
  };

  // Toggle editing button
  const EditingButton = () => {
    let [_, setHovered] = useState(false);
    if (editing) {
      return (
        <button
          className="bg-orange-300 border-2 border-orange-300 my-1"
          onClick={handleClickEdit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconEdit />
        </button>
      );
    } else {
      return (
        <button
          className="bg-slate-950 border-2 border-slate-950 my-1 hover:bg-orange-300"
          onClick={handleClickEdit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconEdit />
        </button>
      );
    }
  };

  // ref for autofocus
  const ref = useRef<HTMLTextAreaElement>(null);

  // auto scale text area height with lines
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // handle Changing the description
  const handleSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = e;
    const { value } = target;
    setInput((prev) => ({ ...prev, description: value }));
    adjustTextareaHeight(target);
  }

  // mutations
  const { removeInstruction, updateInstruction } = useIterationInstruction({ iterationId });

  // Handler for remove
  const handleRemove = async () => {
    let result = await removeInstruction({ step });
    if (result) {
      setEditing(false)

      // Update the global test-kitchen state
      setNodes((prev) => (prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { instructions } = data
          let newInstructions = instructions.filter(el => el.step !== step)
          return {
            ...rest, data: {
              ...data, instructions: newInstructions.map(el => el.step > step ? {
                ...el,
                step: el.step - 1
              } : el)
            }
          };
        } else {
          return { ...rest, data };
        }
      })));

      // emit the change
      socket?.emit(DELETE_INSTRUCTION_CHANNEL, {
        iterationId,
        step,
        recipeId,
        userId,
      })
    };
  };

  // Remove button
  const RemoveButton = () => {
    let [_, setHovered] = useState(false);
    return (
      <button
        className="bg-slate-950 border-2 border-slate-950 mb-1 hover:bg-orange-300"
        onClick={handleRemove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <IconCircleMinus />
      </button>
    )
  }

  // handler for update
  const handleUpdate = async () => {
    let instruction = await updateInstruction({
      step,
      input: instructionInput
    });

    if (instruction) {
      setEditing(false);

      // Update the global test-kitchen state
      setNodes((prev) => (prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { instructions } = data;
          return {
            ...rest,
            data:
            {
              ...data, instructions: instructions.map(el => el.step === step ? instruction : el)
            }
          };
        } else {
          return { ...rest, data };
        }
      })));

      socket?.emit(UPDATE_INSTRUCTION_CHANNEL, {
        instruction,
        recipeId,
        iterationId,
        userId
      });
    };
  };

  // Save button
  const UpdateButton = () => {
    let [_, setHovered] = useState(false);
    return (
      <button
        className="bg-slate-950 border-2 border-slate-950 mb-1 hover:bg-orange-300"
        onClick={handleUpdate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <IconDeviceFloppy />
      </button>
    )
  }

  const toggleTimeAndTemperatureField = () => {
    setInput(({ timeAndTemperature, ...rest }) =>
      instructionInput.timeAndTemperature ? rest : { ...rest, timeAndTemperature: timeAndTemperature || { unit: "C" } }
    );
  };

  // Toggle Time and Temperature field button
  const TimeTemperatureButton = () => {
    let [_, setHovered] = useState(false);
    if (instructionInput.timeAndTemperature && editing) {
      return (
        <button
          onClick={toggleTimeAndTemperatureField}
          className="bg-orange-300 border-2 border-orange-300 my-1"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconFlame />
        </button>
      )
    } else if (editing) {
      return (
        <button
          onClick={toggleTimeAndTemperatureField}
          className="bg-slate-950 border-2 border-slate-950 my-1 hover:bg-orange-300"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconFlame />
        </button>
      )
    } else {
      return (
        <button
          onClick={toggleTimeAndTemperatureField}
          className="bg-slate-950 border-2 border-slate-950 my-1"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          disabled={true}
        >
          <IconFlame />
        </button>
      )
    }
  };

  // set hour field
  const handleSetHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hours = e.target.valueAsNumber;
    setInput(({ timeAndTemperature, ...rest }) => {
      if (!timeAndTemperature) return { ...rest };
      if (hours !== 0) {
        timeAndTemperature.hours = hours;
      } else {
        delete timeAndTemperature.hours
      };
      return { ...rest, timeAndTemperature: { ...timeAndTemperature } }
    })
  };

  // set minute field
  const handleSetMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    let minutes = e.target.valueAsNumber;
    setInput(({ timeAndTemperature, ...rest }) => {
      if (!timeAndTemperature) return { ...rest }
      if (minutes !== 0) {
        timeAndTemperature.minutes = minutes;
      } else {
        delete timeAndTemperature.minutes;
      };
      return { ...rest, timeAndTemperature: { ...timeAndTemperature } }
    })
  };

  // set temperature field
  const handleSetTemperature = (e: React.ChangeEvent<HTMLInputElement>) => {
    let temperature = e.target.valueAsNumber;
    setInput(({ timeAndTemperature, ...rest }) => {
      if (!timeAndTemperature) return { ...rest }
      if (temperature !== 0) {
        timeAndTemperature.temperature = temperature;
      } else {
        delete timeAndTemperature.temperature;
      };
      return { ...rest, timeAndTemperature: { ...timeAndTemperature } }
    })
  };

  // Time and Temperature Input Field
  const TimeTemperatureField = () => {

    let { timeAndTemperature } = instructionInput;
    let hours = timeAndTemperature?.hours;
    let minutes = timeAndTemperature?.minutes;
    let temperature = timeAndTemperature?.temperature;
    let unit = timeAndTemperature?.unit;

    return (
      <>
        <div className="mb-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
          <input
            type="number"
            name="hours"
            value={hours ? hours : ""}
            className="border-0 pl-0 pr-1 w-10 focus:outline-none"
            onChange={handleSetHours}
          />
          <span>hr</span>
        </div>
        <div className="mb-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
          <input
            type="number"
            name="minutes"
            value={minutes ? minutes : ""}
            className="border-0 pl-0 pr-1 w-10 focus:outline-none"
            onChange={handleSetMinutes}
          />
          <span>mins</span>
        </div>
        <div className="mb-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
          <input
            type="number"
            name="temperature"
            value={temperature ? temperature : ""}
            onChange={handleSetTemperature}
            className="border-0 px-0 pr-1 w-14 focus:outline-none"
          />
          <span>{unit}</span>
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-28 py-2 first:pt-0">
      <div className="grow text-sm font-bold justify-between pl-2 border-l-4 border-transparent focus-within:border-orange-300">
        <div className="flex grow items-center justify-between">
          <div>
            Step {step}
          </div>
          <div className="text-xs space-x-2 flex min-w-fit">
            {instructionInput.timeAndTemperature && editing ? (
              <TimeTemperatureField />
            ) : (timeAndTemperature ? (
              <>
                <div className="my-auto flex space-x-2 text-xs">
                  {timeAndTemperature.hours ? (
                    <div>{timeAndTemperature.hours} hr(s)</div>
                  ) : (
                    null
                  )}
                  {timeAndTemperature.minutes ? (
                    <div>{timeAndTemperature.minutes} min(s)</div>
                  ) : (
                    null
                  )}
                  <span>{timeAndTemperature.temperature} {timeAndTemperature.unit}</span>
                </div>
              </>
            ) : null
            )}
            <div>
              <TimeTemperatureButton />
            </div>
          </div>
        </div>
        <div className="grow mb-2 text-xs px-0">
          {editing ? (
            <label>
              <textarea
                ref={ref}
                value={instructionInput.description}
                id={`update-instruction-${instruction.step}`}
                onChange={handleSetDescription}
                className="bg-transparent border-none w-full focus:outline-none overflow-y-hidden resize-none px-0"
                placeholder="Write here..."
              />
            </label>
          ) : (
            <div>
              {instruction.description}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center pl-2 min-w-fit">
        <EditingButton />
        {editing ? (
          <>
            <RemoveButton />
            <UpdateButton />
          </>
        ) : (
          null
        )}
      </div>
    </div>
  );
};


export const UpdatePreparations = ({ instructions, setNodes }: IterationInstructionProps) => {
  return (
    <>
      {instructions?.map((instruction, index) => (
        <UpdateField
          key={index}
          instruction={instruction}
          setNodes={setNodes}
        />
      ))}
    </>
  );
};