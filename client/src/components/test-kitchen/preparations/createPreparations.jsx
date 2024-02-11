import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as dark from "../../../assets/icons/dark"
import { useState, useEffect } from "react";


const Field = ({ instruction, setNewInstructions }) => {

  const { timeAndTemperature, step, description } = instruction;

  const handleSetDescription = (value) => {
    setNewInstructions((prev) => (
      prev.map((el) => {
        if (el.step === step) {
          return { ...el, ["description"]: value }
        } else {
          return el
        }
      })
    ));
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

  return (
    <div
      className="grow text-xs font-bold justify-between mb-1 border-l-4
                 pl-2 border-transparent focus-within:border-orange-300"
    >
      <div className="flex grow justify-between">
        <div className="font-bold text-sm">
          Step {step}
        </div>
        <div className="space-x-2 flex">
          {timeAndTemperature ? (
            <>
              <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                <input
                  type="number"
                  name="hours"
                  value={timeAndTemperature.hours ? timeAndTemperature.hours : ""}
                  className="bg-transparent border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                  onChange={(e) => setTimeTemperatureField(e)}
                />
                <span>hr</span>
              </div>
              <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                <input
                  type="number"
                  name="minutes"
                  value={timeAndTemperature.minutes ? timeAndTemperature.minutes : ""}
                  className="bg-transparent border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                  onChange={(e) => setTimeTemperatureField(e)}
                />
                <span>mins</span>
              </div>
              <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                <input
                  type="number"
                  name="temperature"
                  value={timeAndTemperature.temperature ? timeAndTemperature.temperature : ""}
                  onChange={(e) => setTimeTemperatureField(e)}
                  className=" bg-transparent border-0 px-0 py-1 pr-1 w-14 focus:outline-none"
                />
                <span>{timeAndTemperature.unit}</span>
              </div>
            </>
          ) : (
            null
          )}
          <button
            onClick={toggleTimeAndTemperatureField}
            className={`border-2 ${timeAndTemperature ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
          >
            <img src={dark.Fire} alt="add-temperature-field" />
          </button>
        </div>
      </div>
      <div className="grow border-0 mb-2 px-0 border-transparent min-h-20">
        <label htmlFor={`update-instruction-${instruction.step}`} className="hidden">new instruction input</label>
        <textarea
          value={description}
          id={`input-new-instruction-${instruction.step}`}
          onChange={(e) => handleSetDescription(e.target.value)}
          className="bg-transparent h-20 w-full border-none focus:outline-none px-0"
          placeholder="Write here..."
        />
      </div>
    </div>
  );
}


export const CreatePreparations = ({ instructions, id }) => {

  // form fields for new instructions
  const [newInstructions, setNewInstructions] = useState([]);

  // If no instructions have been added already default to one empty field
  useEffect(() => {
    setNewInstructions((instructions?.length === 0) ? [{
      step: 1,
      description: "",
      iterationId: id
    }] : []);
  }, [instructions]);

  // Add a field to the list of preparations
  const handleAddField = () => {
    setNewInstructions((prev) => [...prev, {
      step: newInstructions?.length + instructions?.length + 1,
      description: "",
      iterationId: id
    }]);
  };



  return (
    <>
      <div className="divide-y divide-slate-950">
        {newInstructions?.map((el) => (
          <Field
            key={el.step}
            instruction={el}
            setNewInstructions={setNewInstructions}
          />
        ))
        }
      </div>
      <div className="flex justify-center space-x-5">
        <button
          onClick={handleAddField}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <img src={dark.Add} alt="add field" />
        </button>
        <button
          onClick={() => console.log('hi')}
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