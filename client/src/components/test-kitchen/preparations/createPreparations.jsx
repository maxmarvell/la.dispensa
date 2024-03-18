import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useContext } from "react";
import { createManyIterationInstruction } from "../../../api/test-kitchen";
import { useParams } from "react-router-dom";

import * as dark from "../../../assets/icons/dark";
import * as light from "../../../assets/icons/light";
import SocketContext from "../../../context/socket";
import AuthContext from "../../../context/auth";

const CREATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_CREATE_INSTRUCTION_CHANNEL


const Field = ({ instruction, setNewInstructions }) => {

  const { timeAndTemperature, step, description } = instruction;

  const handleSetDescription = (e) => {
    const { target } = e;
    const { value } = target;
    setNewInstructions((prev) => (
      prev.map((el) => {
        if (el.step === step) {
          return { ...el, ["description"]: value }
        } else {
          return el
        }
      })
    ));
    adjustTextareaHeight(target);
  };

  const setTimeTemperatureField = (e) => {

    const { value, name } = e.target;

    setNewInstructions((prev) => (
      prev.map(({ timeAndTemperature, ...rest }) => {
        if (rest.step === instruction.step) {
          let newField = timeAndTemperature;
          if (value !== "") {
            newField[name] = value;
          } else {
            delete newField[name]
          };
          return { ...rest, timeAndTemperature: { ...newField } }
        } else {
          return { timeAndTemperature, ...rest }
        };
      })
    ));
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

  const adjustTextareaHeight = (textarea) => {
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
                    name="hours"
                    value={timeAndTemperature.hours ? timeAndTemperature.hours : ""}
                    className="bg-transparent border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={(e) => setTimeTemperatureField(e)}
                  />
                  <span>hr</span>
                </div>
                <div className="my-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
                  <input
                    type="number"
                    name="minutes"
                    value={timeAndTemperature.minutes ? timeAndTemperature.minutes : ""}
                    className="bg-transparent border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={(e) => setTimeTemperatureField(e)}
                  />
                  <span>mins</span>
                </div>
                <div className="my-1 border-b-2 border-black flex items-center focus-within:border-orange-300">
                  <input
                    type="number"
                    name="temperature"
                    value={timeAndTemperature.temperature ? timeAndTemperature.temperature : ""}
                    onChange={(e) => setTimeTemperatureField(e)}
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


export const CreatePreparations = ({ instructions, iterationId, setNodes }) => {

  // form fields for new instructions
  const [newInstructions, setNewInstructions] = useState([]);

  const { socket } = useContext(SocketContext);

  const { user: { id: userId } } = useContext(AuthContext);

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
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createManyIterationInstruction,
  });

  const handleCreate = async () => {
    let results = await mutateAsync({ input: newInstructions, iterationId });
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
          setNodes={setNodes}
        />
      ))
      }
      <div className="flex border-none justify-center space-x-5 pt-2">
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
            src={dark.SaveFill}
            alt="save-icon"
          />
        </button>
      </div>
    </>
  )

}