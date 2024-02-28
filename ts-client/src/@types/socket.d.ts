import { Edge, Node } from "reactflow"
import { IngredientType } from "./recipe";
import { InstructionType } from "./preparations";


export type CountMessageType = {
  count: number
};

interface BaseLayout {
  id: string,
    position: {
      x: number,
      y: number
    }
};

export type NodeDragMessageType = {
  layout: BaseLayout,
  userId: string,
  recipeId: string,
};

export type NodeCreateMessageType = {
  newEdge: Edge,
  newNode: Node,
  userId: string,
  recipeId: string,
};

export type NodeDeleteMessageType = {
  iterationId: string,
  userId: string
};

export type CreateIngredientsMessageType = {
  newIngredients: IngredientType[]
  iterationId: string,
  recipeId: string,
  userId: string
};

export type DeleteIngredientMessageType = {
  iterationId: string,
  recipeId: string,
  userId: string,
  ingredientId: string
};

export type UpdateIngredientMessageType = {
  ingredient: IngredientType,
  iterationId: string,
  recipeId: string,
  userId: string,
  ingredientId: string
};

export type CreateInstructionsMessageType = {
  newInstructions: InstructionType[]
  iterationId: string,
  recipeId: string,
  userId: string
};

export type DeleteInstructionMessageType = {
  step: number,
  iterationId: string,
  recipeId: string,
  userId: string
};

export type UpdateInstructionChannel = {
  instruction: InstructionType
  iterationId: string,
  recipeId: string,
  userId: string
  step: number
};
