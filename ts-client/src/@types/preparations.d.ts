import { BaseComponent } from "./components";
import { AdvancedRecipeType } from "./recipe";

export type TimeAndTemperatureType = {
  hours?: number,
  minutes?: number,
  unit?: "C" | "K";
  temperature?: number
};

export type TimeAndTemperatureInput = {
  [P in keyof TimeAndTemperatureType]: string;
};

export interface BaseInstruction {
  description: string,
  timeAndTemperature?: TimeAndTemperatureType,
  step: number,
};

export interface InstructionType extends BaseInstruction {
  recipeId?: string,
  iterationId?: string,
};

export interface InstructionInput {
  description: string,
  step: number,
  recipeId?: string,
  iterationId?: string,
  timeAndTemperature?: TimeAndTemperatureInput
};

export type CreatePreparationPropsType = {
  instruction: InstructionInput,
  setNewInstructions: React.Dispatch<React.SetStateAction<InstructionInput[]>>,
};

export type RecipePreparations = {
  instructions: InstructionType[],
  components: AdvancedRecipeType[],
};