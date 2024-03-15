import { useRef } from "react";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IconDeviceFloppy, IconFlame, IconX } from "@tabler/icons-react";

import { InstructionInputProps } from "./models";

export const InstructionInput = ({ instruction, descriptionHandler, timeAndTemperatureHandler, removeInstruction, updateInstruction }: InstructionInputProps) => {

  // extract relavent information with instruction
  const { step, timeAndTemperature } = instruction;

  // ref for autofocus
  const ref = useRef<HTMLTextAreaElement>(null);

  // auto scale text area height with lines
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // handle the change in description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!descriptionHandler) return;
    const { target } = e;
    descriptionHandler({ description: target.value, step: instruction.step });
    adjustTextareaHeight(target);
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Description for Step {instruction.step}</Label>
      <Textarea
        ref={ref}
        placeholder="Type the description here."
        value={instruction.description}
        id="message"
        onChange={e => handleDescriptionChange(e)}
      />
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            className={`hover:bg-orange-300 hover:text-slate-950 aspect-square p-0 ${timeAndTemperature ? (
              "bg-orange-300 text-slate-950"
            ) : "bg-slate-950 text-white"}`}
            onClick={() => (
              timeAndTemperature ? (
                timeAndTemperatureHandler({ step })
              ) : timeAndTemperatureHandler({ step, timeAndTemperature: { unit: "C" } })
            )}
          >
            <IconFlame className="size-5" />
          </Button>
          {timeAndTemperature && (
            <>
              <div className="flex justify-between items-center rounded-md px-2 border border-input shadow-sm focus-within:ring-1 focus-visible:ring-ring">
                <input
                  type="number"
                  name="hours"
                  value={timeAndTemperature?.hours || ""}
                  onChange={e => {
                    let { hours, ...rest } = timeAndTemperature
                    e.target.valueAsNumber ? timeAndTemperatureHandler(
                      { step, timeAndTemperature: { ...timeAndTemperature, hours: e.target.valueAsNumber } }
                    ) : timeAndTemperatureHandler(
                      { step, timeAndTemperature: rest }
                    )
                  }}
                  className="border-0 bg-transparent pr-1 w-10 h-9 focus:outline-none"
                />
                <span>hr</span>
              </div>
              <div className="flex justify-between items-center rounded-md px-2 border border-input shadow-sm focus-within:ring-1 focus-visible:ring-ring">
                <input
                  type="number"
                  name="minutes"
                  value={timeAndTemperature?.minutes || ""}
                  onChange={e => {
                    let { minutes, ...rest } = timeAndTemperature
                    e.target.valueAsNumber ? timeAndTemperatureHandler(
                      { step, timeAndTemperature: { ...timeAndTemperature, minutes: e.target.valueAsNumber } }
                    ) : timeAndTemperatureHandler(
                      { step, timeAndTemperature: rest }
                    )
                  }}
                  className="border-0 bg-transparent pr-1 w-10 h-9 focus:outline-none"
                />
                <span>mins</span>
              </div>
              <div className="flex justify-between items-center rounded-md px-2 border border-input shadow-sm focus-within:ring-1 focus-visible:ring-ring">
                <input
                  type="number"
                  name="temperature"
                  value={timeAndTemperature?.temperature || ""}
                  onChange={e => {
                    let { temperature, ...rest } = timeAndTemperature
                    e.target.valueAsNumber ? timeAndTemperatureHandler(
                      { step, timeAndTemperature: { ...timeAndTemperature, temperature: e.target.valueAsNumber } }
                    ) : timeAndTemperatureHandler(
                      { step, timeAndTemperature: rest }
                    )
                  }}
                  className="border-0 bg-transparent pr-1 w-12 h-9 focus:outline-none"
                />
                <span>C</span>
              </div>
            </>
          )}
        </div>
        <div className="space-x-1">
          {updateInstruction &&
            <Button
              className="bg-slate-950 text-white hover:bg-orange-300 hover:text-slate-950 aspect-square p-0"
              onClick={() => updateInstruction({ step: instruction.step, input: instruction })}
            >
              <IconDeviceFloppy className="size-5" />
            </Button>
          }
          {removeInstruction && (
            <Button
              variant="destructive"
              className="aspect-square p-0 bg-red-800"
              onClick={() => removeInstruction({ step: instruction.step })}
            >
              <IconX className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}