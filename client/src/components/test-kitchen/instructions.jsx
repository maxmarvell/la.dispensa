import { useState } from "react";
import { updateIterationInstruction } from "../../api/test-kitchen"
import { ClockFill, FireFill, Save } from "../../assets/icons"
import { useMutation } from "@tanstack/react-query"

const InstructionField = ({ instruction, setNodes }) => {

  const { iterationId, step } = instruction;

  const { temperature, time, ...data } = instruction;

  const [ updatedInstruction, setUpdates ] = useState((temperature && time) ? instruction : temperature ? { ...data, temperature } : time ? { ...data, time } : data);

  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateIterationInstruction
  });

  const handleUpdate = async () => {

    // Await the update
    let newInstruction = await updateMutation({
      input: updatedInstruction, iterationId, step
    });

    // update the global node state
    setNodes(prev => prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        let { instructions } = data;
        return { ...rest, data: { ...data, instructions: instructions.map(el => el.step === step ? newInstruction : el) } };
      } else {
        return { ...rest, data };
      };
    }));
  };


  return (
    <div className="space-y-3 border p-2 border-black relative">
      <div className="text-sm font-bold uppercase text-center">Step {step}</div>
      <div className="text-center">{instruction.description}</div>
      <div className="flex space-x-2 justify-center">
        <img className="h-5 w-5 my-auto" src={ClockFill} alt="add-time-field" />
        <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2 focus-within:outline-none">
          <input
            type="number"
            value={updatedInstruction.time?.hours || ""}
            className="border-0 pl-0 pr-1 py-1 w-10 focus:outline-none bg-transparent"
            onChange={e => setUpdates(({ time, time: { minutes }, ...rest }) => {
              return e.target.value ? { ...rest, time: { ...time, hours: e.target.value } } : minutes ? { ...rest, time: { minutes } } : rest
            })}
          />
          <span>hr</span>
        </div>
        <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2 focus-within:outline-none">
          <input
            type="number"
            value={updatedInstruction.time?.minutes || ""}
            className="border-0 pl-0 pr-1 py-1 w-10 focus:outline-none bg-transparent"
            onChange={e => setUpdates(({ time, time: { hours }, ...rest }) => (
              e.target.value ? { ...rest, time: { ...time, minutes: e.target.value } } : hours ? { ...rest, time: { hours } } : rest
            ))}
          />
          <span>mins</span>
          <button
            className="absolute top-2 right-3 h-5 w-5"
            onClick={handleUpdate}
          >
            <img src={Save} alt="save instruction changes" />
          </button>
        </div>
      </div>
      <div className="flex space-x-2 justify-center">
        <img className="h-5 w-5 my-auto" src={FireFill} alt="add-temperature-field" />
        <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2 focus-within:outline-none">
          <input type="number" value={updatedInstruction.temperature?.temperature || ""}
            onChange={e => setUpdates(({ temperature, ...rest }) => (e.target.value ? { ...rest, temperature: { ...temperature, temperature: e.target.value } } : rest))}
            className="border-0 pl-0 pr-1 py-1 w-14 focus:outline-none bg-transparent"
          />
          <span>{updatedInstruction.temperature?.unit || "C"}</span>
        </div>
      </div>
    </div>
  )
}


const Instructions = ({ iteration, setNodes }) => {
  return (
    <div className="flex flex-col divide-y-1 divide-black">
      {iteration.instructions.map((el, index) => (
        <InstructionField
          instruction={el}
          setNodes={setNodes}
          key={index}
        />
      ))}
    </div>
  )
}

export default Instructions