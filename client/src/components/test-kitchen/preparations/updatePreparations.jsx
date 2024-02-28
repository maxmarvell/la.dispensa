import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// APIs
import { updateIterationInstruction, removeIterationInstruction } from "../../../api/test-kitchen";

// assets
import * as dark from "../../../assets/icons/dark";
import * as light from "../../../assets/icons/light";

// contexts
import AuthContext from "../../../context/auth";
import SocketContext from "../../../context/socket";

// channels
const UPDATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_UPDATE_INSTRUCTION_CHANNEL
const DELETE_INSTRUCTION_CHANNEL = import.meta.env.VITE_DELETE_INSTRUCTION_CHANNEL

const UpdateField = ({ instruction, setNodes }) => {

  // Extract relavent information with instruction
  const { step, ...data } = instruction;
  const { iterationId, timeAndTemperature, ...rest } = data;

  const { recipeId } = useParams();
  const { user: { id: userId } } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  // Set the instruction input field
  const [instructionInput, setInput] = useState(timeAndTemperature ? data : rest);
  useEffect(() => (
    setInput(timeAndTemperature ? data : rest)
  ), [instruction]);

  // EDIT FUNCTIONALITY
  // State to toggle whether editing or not
  const [editing, setEditing] = useState(false);

  // Handle click of the edit button
  const handleClickEdit = () => {
    setEditing(!editing);
    window.setTimeout(() => {
      if (!editing) {
        ref.current.focus();
        let inputLength = ref.current.value.length;
        ref.current.setSelectionRange(inputLength, inputLength);
      }
    }, 0);
  };

  // Toggle editing button
  const EditingButton = () => {
    let [hovered, setHovered] = useState(false);
    if (editing) {
      return (
        <button
          className="bg-orange-300 border-2 border-orange-300 my-1"
          onClick={handleClickEdit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img src={dark.Edit} className="w-5" alt="edit-this-step" />
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
          <img src={hovered ? dark.Edit : light.Edit} className="w-5" alt="edit-this-step" />
        </button>
      );
    }
  };

  // Ref for autofocus
  const ref = useRef(null);

  // Auto scale text area height with lines
  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // handle Changing the description
  const handleSetDescription = (e) => {
    const { target } = e;
    const { value } = target;
    setInput((prev) => ({ ...prev, description: value }));
    adjustTextareaHeight(target);
  }

  // Remove an Instruction
  const { mutateAsync: removeMutation } = useMutation({
    mutationFn: removeIterationInstruction
  });

  // Handler for remove
  const handleRemove = async () => {
    let result = await removeMutation({
      iterationId, step
    });
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
    let [hovered, setHovered] = useState(false);
    return (
      <button
        className="bg-slate-950 border-2 border-slate-950 mb-1 hover:bg-orange-300"
        onClick={handleRemove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img src={hovered ? dark.Remove : light.Remove} className="w-5" alt="remove-icon" />
      </button>
    )
  }

  // Update an instruction
  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateIterationInstruction
  });

  // Handler for update
  const handleUpdate = async () => {
    let instruction = await updateMutation({
      step,
      iterationId,
      input: instructionInput
    });

    if (instruction) {
      setEditing(false);

      console.log(instruction)

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
    let [hovered, setHovered] = useState(false);
    return (
      <button
        className="bg-slate-950 border-2 border-slate-950 mb-1 hover:bg-orange-300"
        onClick={handleUpdate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img src={hovered ? dark.Save : light.Save} className="w-5" alt="remove-icon" />
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
    let [hovered, setHovered] = useState(false);
    if (instructionInput.timeAndTemperature && editing) {
      return (
        <button
          onClick={toggleTimeAndTemperatureField}
          className="bg-orange-300 border-2 border-orange-300 my-1"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img src={dark.Fire} className="w-5" alt="add-temperature-field" />
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
          <img src={hovered ? dark.Fire : light.Fire} className="w-5" alt="add-temperature-field" />
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
          <img src={light.Fire} className="w-5" alt="add-temperature-field" />
        </button>
      )
    }
  };

  const setTimeTemperatureField = (e) => {

    const { value, name } = e.target;

    setInput(({ timeAndTemperature, ...rest }) => {
      let newField = timeAndTemperature;
      if (value !== "") {
        newField[name] = value;
      } else {
        delete newField[name]
      };
      return { ...rest, timeAndTemperature: { ...newField } }
    })
  };

  // Time and Temperature Input Field
  const TimeTemperatureField = () => {

    let { timeAndTemperature: { hours, minutes, temperature, unit } } = instructionInput;

    return (
      <>
        <div className="mb-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
          <input
            type="number"
            name="hours"
            value={hours ? hours : ""}
            className="border-0 pl-0 pr-1 w-10 focus:outline-none"
            onChange={(e) => setTimeTemperatureField(e)}
          />
          <span>hr</span>
        </div>
        <div className="mb-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
          <input
            type="number"
            name="minutes"
            value={minutes ? minutes : ""}
            className="border-0 pl-0 pr-1 w-10 focus:outline-none"
            onChange={(e) => setTimeTemperatureField(e)}
          />
          <span>mins</span>
        </div>
        <div className="mb-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
          <input
            type="number"
            name="temperature"
            value={temperature ? temperature : ""}
            onChange={(e) => setTimeTemperatureField(e)}
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


export const UpdatePreparations = ({ instructions, iterationId, setNodes }) => {
  return (
    <>
      {instructions?.map((instruction, index) => (
        <UpdateField
          key={index}
          instruction={instruction}
          iterationId={iterationId}
          setNodes={setNodes}
        />
      ))}
    </>
  );
};