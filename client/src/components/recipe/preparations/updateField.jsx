import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update as updateInstruction, remove as removeInstruction } from "../../../api/instructions";
import * as dark from "../../../assets/icons/dark"

const UpdateField = ({ instruction }) => {

  const { recipeId, step, ...data } = instruction;

  const { timeAndTemperature, ...rest } = data;

  const [mutateInstruction, setMutation] = useState(timeAndTemperature ? data : rest);

  useEffect(() => (
    setMutation(timeAndTemperature ? data : rest)
  ), [instruction]);

  const queryClient = useQueryClient();

  const { mutateAsync: removeMutation } = useMutation({
    mutationFn: removeInstruction,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructions'])
    },
  });

  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateInstruction,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructions'])
    },
  });

  const [editing, setEditing] = useState(false);

  const ref = useRef(null);

  const handleClickEdit = () => {
    setEditing(!editing);
    window.setTimeout(() => {
      if (!editing) {
        ref.current.focus()
      }
    }, 0);
  };

  const [savePending, setSavePending] = useState(false)
  const handleSave = async () => {
    setSavePending(true);
    let result = await updateMutation({
      instructionId,
      data: mutateInstruction
    });
    if (result) {
      setEditing(false);
    };
    setSavePending(false);
  };

  const [removePending, setRemovePending] = useState(false)
  const handleRemove = async () => {
    setRemovePending(true);
    let result = await removeMutation({
      recipeId, step
    });
    if (result) {
      setEditing(false)
    }
    setRemovePending(false);
  };

  const toggleTimeAndTemperatureField = () => {
    setMutation(({ timeAndTemperature, ...rest }) =>
      timeAndTemperature ? rest : { ...rest, timeAndTemperature: instruction.timeAndTemperature }
    );
  };

  const setTimeTemperatureField = (e) => {

    const { value, name } = e.target;

    setMutation(({ timeAndTemperature, ...rest }) => {
      let newField = timeAndTemperature;
      if (value !== "") {
        newField[name] = value;
      } else {
        delete newField[name]
      };
      return { ...rest, timeAndTemperature: { ...newField } }
    })
  };


  return (
    <div className="flex">
      <div className="grow text-lg font-bold justify-between border-l-4 border-transparent focus-within:border-orange-300">
        <div className="flex grow justify-between">
          <div>
            Step {step}
          </div>
          <div className="text-xs space-x-2 flex min-w-fit">
            {(timeAndTemperature && editing) ? (
              <>
                <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                  <input
                    type="number"
                    name="hours"
                    value={mutateInstruction.timeAndTemperature.hours ? mutateInstruction.timeAndTemperature.hours : ""}
                    className="border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={(e) => setTimeTemperatureField(e)}
                  />
                  <span>hr</span>
                </div>
                <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                  <input
                    type="number"
                    name="minutes"
                    value={mutateInstruction.timeAndTemperature.minutes ? mutateInstruction.timeAndTemperature.minutes : ""}
                    className="border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={(e) => setTimeTemperatureField(e)}
                  />
                  <span>mins</span>
                </div>
                <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                  <input
                    type="number"
                    name="temperature"
                    value={mutateInstruction.timeAndTemperature.temperature ? mutateInstruction.timeAndTemperature.temperature : ""}
                    onChange={(e) => setTimeTemperatureField(e)}
                    className=" border-0 px-0 py-1 pr-1 w-14 focus:outline-none"
                  />
                  <span>{mutateInstruction.timeAndTemperature.unit}</span>
                </div>
              </>
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
            ) : (
              null
            )
            )}
            <button
              onClick={toggleTimeAndTemperatureField}
              className={`border-2 ${timeAndTemperature ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
            >
              <img src={dark.Fire} alt="add-temperature-field" />
            </button>
          </div>
        </div>
        <div
          className="grow border mb-2 text-sm
                     px-0 border-transparent min-h-16"
        >
          {editing ? (
            <>
              <label htmlFor={`update-instruction-${instruction.step}`} className="hidden">new instruction input</label>
              <textarea
                ref={ref}
                value={mutateInstruction.description}
                id={`update-instruction-${instruction.step}`}
                onChange={(e) => setMutation((prev) => ({ ...prev, description: e.target.value }))}
                className="h-full w-full border-none focus:outline-none px-0"
                placeholder="Write here..."
              />
            </>
          ) : (
            <div className="py-2">
              {instruction.description}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-1 pl-2 min-w-fit">
        <button
          className={`border-2 ${editing ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
          onClick={handleClickEdit}
        >
          <img src={dark.Edit} alt="edit-this-step" />
        </button>
        {editing ? (
          <>
            <button
              className={`border-2 ${false ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
              onClick={handleRemove}
            >
              {removePending ? (
                <img src={dark.RemoveFill} alt="remove-icon" />
              ) : (
                <img src={dark.Remove} alt="remove-icon"

                />
              )}
            </button>
            <button
              className={`border-2 ${savePending ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
              onClick={handleSave}
            >
              <img src={savePending ? dark.SaveFill : dark.Save} alt="save-icon" />
            </button>
          </>
        ) : (
          null
        )}
      </div>
    </div>
  )
}

export default UpdateField