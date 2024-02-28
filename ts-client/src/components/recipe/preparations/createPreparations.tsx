import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// services
import { createInstructions, getInstructions } from "../../../api/instructions";

// components
import * as dark from "../../../assets/icons/dark";
import * as light from "../../../assets/icons/light";

// types
import { CreatePreparationPropsType, InstructionInput, TimeAndTemperatureInput } from "../../../@types/preparations";

const Field = ({ instruction, setNewInstructions }: CreatePreparationPropsType) => {

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
    let hours = e.target.value;
    setNewInstructions(prev => prev.map(({ timeAndTemperature, ...rest }) => {
        if (rest.step === instruction.step) {
          let newField = timeAndTemperature as TimeAndTemperatureInput;
          if (hours !== "") {
            newField.hours = hours;
          } else {
            delete newField.hours
          };
          return { ...rest, timeAndTemperature: { ...newField } }
        } else {
          return { timeAndTemperature, ...rest }
        };
      })
    );
  };

  // set minute field
  const handleSetMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    let minutes = e.target.value;
    setNewInstructions(prev => prev.map(({ timeAndTemperature, ...rest }) => {
        if (rest.step === instruction.step) {
          let newField = timeAndTemperature as TimeAndTemperatureInput;
          if (minutes !== "") {
            newField.minutes = minutes;
          } else {
            delete newField.minutes
          };
          return { ...rest, timeAndTemperature: { ...newField } }
        } else {
          return { timeAndTemperature, ...rest }
        };
      })
    );
  };

  // set temperature field
  const handleSetTemperature = (e: React.ChangeEvent<HTMLInputElement>) => {
    let temperature = e.target.value;
    setNewInstructions(prev => prev.map(({ timeAndTemperature, ...rest }) => {
        if (rest.step === instruction.step) {
          let newField = timeAndTemperature as TimeAndTemperatureInput;
          if (temperature !== "") {
            newField.temperature = temperature;
          } else {
            delete newField.temperature
          };
          return { ...rest, timeAndTemperature: { ...newField } }
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
    const [hovered, setHovered] = useState(false);
    if (timeAndTemperature) {
      return (
        <button
          onClick={toggleTimeAndTemperatureField}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="border-2 border-orange-300 my-1 bg-orange-300"
        >
          <img src={dark.Fire} className="w-5" alt="add-temperature-field" />
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
          <img src={hovered ? dark.Fire : light.Fire} className="w-5" alt="add-temperature-field" />
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
    const [hovered, setHovered] = useState(false);
    return (
      <button
        onClick={removeField}
        className="border-2 border-slate-950 my-1 bg-slate-950 hover:bg-orange-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img src={hovered ? dark.Remove : light.Remove} className="w-5" alt="add-temperature-field" />
      </button>
    );
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="flex">
      <div
        className="grow text-lg font-bold justify-between mb-1 border-l-4
                   pl-2 border-transparent focus-within:border-orange-300"
      >
        <div className="flex grow justify-between">
          <div className="font-bold">
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
          className="grow border-0 mb-2 text-sm
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

export const CreatePreparations = () => {

  // Retrieve recipeId from params
  const { recipeId } = useParams();

  // Get the instructions and components for this recipe id
  const { data } = useQuery({
    queryKey: ['instructions', recipeId],
    queryFn: () => getInstructions({ recipeId })
  });
  const instructions = data?.instructions;

  // form fields for new instructions
  const [newInstructions, setNewInstructions] = useState<InstructionInput[]>([]);

  // If no instructions have been added already default to one empty field
  useEffect(() => {
    setNewInstructions((instructions?.length === 0) ? [{
      step: 1,
      description: "",
      recipeId,
    }] : []);
  }, [instructions]);

  // Use query client to invalidate instruction query
  const queryClient = useQueryClient();

  // Add mutation invalidates get instructions
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createInstructions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions'] })
    },
  });

  const handleAddField = () => {
    let len = instructions?.length as number;
    setNewInstructions(prev => [...prev, {
      step: newInstructions?.length + len + 1,
      description: "",
      recipeId
    }]);
  };

  const handleCreate = async () => {
    await mutateAsync({ data: newInstructions });
  };


  return (
    <div className="py-2">
      {newInstructions?.map((el) => (
        <Field
          key={el.step}
          instruction={el}
          setNewInstructions={setNewInstructions}

        />
      ))
      }
      <div className="flex justify-center space-x-5">
        <button
          onClick={handleAddField}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <img src={dark.Add} alt="add field" />
        </button>
        <button
          onClick={handleCreate}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <img
            src={isPending ? dark.Refresh : dark.SaveFill}
            className={isPending ? "animate-spin" : ""}
            alt="save-icon"
          />
        </button>
      </div>
    </div>
  )
};