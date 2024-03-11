import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// services
import { useInstruction } from "@/pages/recipe/hooks/useInstruction";
import { IconCircleMinus, IconCirclePlus, IconDeviceFloppy, IconFlame } from "@tabler/icons-react";

// types
import { CreatePreparationPropsType } from "@/pages/recipe/models";
import { BaseRecipeInstructionType } from "@/types/recipe";

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
    let hours = e.target.valueAsNumber;
    setNewInstructions(prev => prev.map(({ timeAndTemperature, ...rest }) => {
      if (rest.step === instruction.step && timeAndTemperature) {
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
      if (rest.step === instruction.step && timeAndTemperature) {
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
      if (rest.step === instruction.step && timeAndTemperature) {
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
                    value={timeAndTemperature.hours ? timeAndTemperature.hours : 0}
                    className="bg-transparent border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={handleSetHours}
                  />
                  <span>hr</span>
                </div>
                <div className="my-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
                  <input
                    type="number"
                    value={timeAndTemperature.minutes ? timeAndTemperature.minutes : 0}
                    className="bg-transparent border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={handleSetMinutes}
                  />
                  <span>mins</span>
                </div>
                <div className="my-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
                  <input
                    type="number"
                    value={timeAndTemperature.temperature ? timeAndTemperature.temperature : 0}
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

  const handleCreate = async () => {
    await createInstructions.mutateAsync({ input: newInstructions });
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
          <IconCirclePlus />
        </button>
        <button
          onClick={handleCreate}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <IconDeviceFloppy />
        </button>
      </div>
    </div>
  )
};