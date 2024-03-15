import { RemoveIterationInstructionProps, UpdateIterationInstructionProps } from "@/pages/test-kitchen/models";
import { IterationInstructionType } from "@/types/iteration";
import { BaseRecipeInstructionType } from "@/types/recipe";
import { TimeAndTemperatureType } from "@/types/instruction";
import { NewInstructionInputType } from "@/types/instruction";

export type InstructionInputProps = {
  instruction: IterationInstructionType | BaseRecipeInstructionType | NewInstructionInputType
  timeAndTemperatureHandler: ({ timeAndTemperature, step }: { timeAndTemperature?: TimeAndTemperatureType, step: number }) => void
  descriptionHandler: ({ description, step }: { description: string, step: number }) => void
  removeInstruction?: (({ step }: RemoveIterationInstructionProps) => Promise<any>) | (({ step }: { step: number; }) => void)
updateInstruction ?: ({ input, step }: UpdateIterationInstructionProps) => Promise<any>
}