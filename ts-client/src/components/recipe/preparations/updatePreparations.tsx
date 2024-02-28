import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// APIs
import { getInstructions, updateInstruction, removeInstruction } from "../../../api/instructions";

// Components
import * as dark from "../../../assets/icons/dark";
import * as light from "../../../assets/icons/light";

// types
import { InstructionInput, InstructionType, TimeAndTemperatureInput } from "../../../@types/preparations";

const UpdateField = ({ instruction }: { instruction: InstructionType }) => {

  // Extract relavent information with instruction
  const { recipeId, step, ...data } = instruction as any;
  const { timeAndTemperature, ...rest } = data;

  // Set the instruction input field
  const [instructionInput, setInput] = useState<InstructionInput>(timeAndTemperature ? data : rest);
  
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
        ref?.current?.focus();
        let inputLength = ref?.current?.value.length;
        ref?.current?.setSelectionRange(inputLength || 0, inputLength || 0);
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
  const ref = useRef<HTMLTextAreaElement | null>(null);

  // Auto scale text area height with lines
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // handle Changing the description
  const handleSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = e;
    const { value } = target;
    setInput(prev => ({ ...prev, description: value }));
    adjustTextareaHeight(target);
  }

  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // Remove an Instruction
  const { mutateAsync: removeMutation } = useMutation({
    mutationFn: removeInstruction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions'] })
    },
  });

  // Handler for remove
  const handleRemove = async () => {
    let result = await removeMutation({
      recipeId, step
    });
    if (result) {
      setEditing(false)
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
    mutationFn: updateInstruction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions'] })
    },
  });

  // Handler for update
  const handleUpdate = async () => {
    let result = await updateMutation({
      step,
      recipeId,
      data: instructionInput
    });
    if (result) {
      setEditing(false);
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

  // set hour field
  const handleSetHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hours = e.target.value;
    setInput(({ timeAndTemperature, ...rest }) => {
      let newField = timeAndTemperature as TimeAndTemperatureInput;
      if (hours !== "") {
        newField.hours = hours;
      } else {
        delete newField.hours
      };
      return { ...rest, timeAndTemperature: { ...newField } }
    })
  };

  // set minute field
  const handleSetMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    let minutes = e.target.value;
    setInput(({ timeAndTemperature, ...rest }) => {
      let newField = timeAndTemperature as TimeAndTemperatureInput;
      if (minutes !== "") {
        newField.minutes = minutes;
      } else {
        delete newField.minutes;
      };
      return { ...rest, timeAndTemperature: { ...newField } }
    })
  };

  // set temperature field
  const handleSetTemperature = (e: React.ChangeEvent<HTMLInputElement>) => {
    let temperature = e.target.value;
    setInput(({ timeAndTemperature, ...rest }) => {
      let newField = timeAndTemperature as TimeAndTemperatureInput;
      if (temperature !== "") {
        newField.temperature = temperature;
      } else {
        delete newField.temperature;
      };
      return { ...rest, timeAndTemperature: { ...newField } }
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
    <div className="flex min-h-24">
      <div className="grow text-lg font-bold justify-between pl-2 border-l-4 border-transparent focus-within:border-orange-300">
        <div className="flex grow justify-between">
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
        <div className="grow mb-2 text-sm px-0">
          {editing ? (
            <label>
              <textarea
                ref={ref}
                value={instructionInput.description}
                id={`update-instruction-${instruction.step}`}
                onChange={handleSetDescription}
                className="border-none w-full focus:outline-none overflow-y-hidden resize-none px-0"
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

export const UpdatePreparations = () => {

  const { recipeId } = useParams();

  // Get the instructions and components for this recipe id
  const { data } = useQuery({
    queryKey: ['instructions', recipeId],
    queryFn: () => getInstructions({ recipeId })
  });
  const instructions = data?.instructions;

  return (
    <>
      {instructions?.map((instruction, index) => (
        <UpdateField
          key={index}
          instruction={instruction}
        />
      ))}
    </>
  );
};