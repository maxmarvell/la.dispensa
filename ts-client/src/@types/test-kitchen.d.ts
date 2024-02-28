
import { BaseUser, UserType } from "./user";
import { NewIngredientType } from "./ingredients";
import { Node, Edge } from "reactflow";
import { IngredientType } from "./ingredients";
import { InstructionInput, InstructionType } from "./preparations";

export interface BaseIteration {
  id: string,
  tag: string,
};

export interface IterationType extends BaseIteration {
  parentIngredients: IngredientType<{ recipeId?: string, iterationId?: string }>[],
  parentInstructions: InstructionType<{ recipeId?: string, iterationId?: string }>[],
  ingredients: IngredientType<{ iterationId: string }>[],
  instructions: InstructionType<{ iterationId: string }>[],
};


export type IterationNodeProps = {
  data: IterationType,
  selected: boolean
};

export type CommentType = {
  id: string,
  text: string,
  createdOn: Date,
  iterationId: string,
  userId: string,
  user: UserType
};

export type CommentFeedMessageType = {
  userId: string,
  newComment: CommentType,
};


export type NewIterationIngredientType = {
  index: number,
  quantity: number | string,
  ingredient: {
    name: string
  },
  unit?: "G" | "KG" | "CUP" | "ML" | "L" | "OZ",
};


export type IterationProps = {
  iteration: IterationType,
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>
}


export type NodeType = {
  id: string,
  data: IterationType,
  type: string,
  position: {
    x: number,
    y: number
  },
};

export type EdgeType = {
  id: string,
  source: string,
  target: string,
};


export type IterationLayoutType = {
  initialNodes: Node<IterationType>[],
  initialEdges: FlatArray<Edge>
};

export type UpdateIngredientProps = {
  data: IngredientType,
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>
  setCurrentIngredients: React.Dispatch<React.SetStateAction<IngredientType[]>>
  setSelectOptions: React.Dispatch<React.SetStateAction<IngredientType[]>>
}

export type CreateIngredientProps = {
  newIngredient: NewIterationIngredientType,
  setNewIngredients: React.Dispatch<React.SetStateAction<NewIterationIngredientType[]>>
}

export type CreateInstructionProps = {
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>,
  iterationId: string,
  instructions: InstructionType[]
}

export type NewInstructionFieldProps = {
  instruction: InstructionInput,
  setNewInstructions: React.Dispatch<React.SetStateAction<InstructionInput[]>>
}

export type MutateInstructionProps = {
  instruction: InstructionType,
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>,
}
