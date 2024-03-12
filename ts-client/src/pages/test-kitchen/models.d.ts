import { BaseRecipeType } from "@/types/recipe"
import { IterationCommentType, IterationIngredientType, IterationInstructionType, IterationType } from "@/types/iteration";
import { BaseInstructionType } from "@/types/instruction";
import { BaseIngredientType, NewIngredientInputType } from "@/types/ingredient";
import { Node, Edge } from "reactflow";

export type IterationLayoutType = {
  initialNodes: Node<IterationType>[],
  initialEdges: FlatArray<Edge>
};

export type UseLayoutProps = {
  recipeId?: string
};

export type IterationNodeProps = {
  data: IterationType,
  selected: boolean
};

export type CommentFeedMessageType = {
  userId: string,
  newComment: CommentType,
};

export type IterationProps = {
  iteration: IterationType,
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>
}


// iteration instructions 

export type IterationInstructionProps = {
  instructions: IterationInstructionType[]
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>
}

export type IterationInstructionFieldProps = {
  instruction: IterationInstructionType
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>
}

export type NewIterationInstructionsProps = {
  instructions: IterationInstructionType[]
  iterationId: string
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>
}

export type NewIterationInstructionFieldProps = {
  instruction: BaseInstructionType
  setNewInstructions: React.Dispatch<React.SetStateAction<BaseInstructionType[]>>
}


// iteration ingredients

export type IterationIngredientFieldProps = {
  data: IterationIngredientType
  setNodes: React.Dispatch<React.SetStateAction<Node<IterationType, string | undefined>[]>>
  setCurrentIngredients: React.Dispatch<React.SetStateAction<IterationIngredientType[]>>
  setSelectOptions: React.Dispatch<React.SetStateAction<IterationIngredientType[]>>
}

export type CreateIterationIngredientFieldProps = {
  newIngredient: BaseIngredientType<{index: number}>
  setNewIngredients: React.Dispatch<React.SetStateAction<BaseIngredientType<{index: number}>[]>>
}


// iteration feedback

export type IterationFeedbackProps = {
  iteration: IterationType
}

export type IterationRatingProps = {
  iteration: IterationType
}

export type CommentsProps = {
  iteration: IterationType
}

export type CommentInputProps = {
  iterationId: string
}

export type CommentWrapProps = {
  comment: IterationCommentType
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



export type UseSearchTestKitchenProps = {
  userId?: string
  title: string
};

export type SearchTestKitchenReturnType = Promise<BaseRecipeType[] | undefined>;


// use iteration

export type UseIterationProps = {
  recipeId?: string
}

export type GetIterationsReturnType = Promise<IterationType[] | undefined>

export type CreateIterationProps = {
  recipeId: string
  tag?: string
  parentId?: string
}

export type UpdateIterationProps = {
  iterationId: string
  input: {
    tag?: string
    description?:string
  }
}

export type DeleteIterationProps = {
  iterationId: string
}


// use iteration instruction

export type UseIterationInstructionProps = {
  iterationId?: string
}

export type CreateManyIterationInstructionProps = {
  input: BaseInstructionType[]
}

export type UpdateIterationInstructionProps = {
  input: Omit<BaseInstructionType, 'step'>
  step: number
}

export type RemoveIterationInstructionProps = {
  step: number
}


// useIterationIngredient models

export type UseIterationIngredientProps = {
  iterationId?: string
}

export type UpdateIterationIngredientProps = {
  ingredientId: string
  input: BaseIngredientType
}

export type CreateManyIterationIngredientProps = {
  input: NewIngredientInputType[]
}

export type RemoveIterationIngredientProps = {
  ingredientId: string
}


// useComment models

export type UseCommentProps = {
  iterationId: string
}

export type CreateCommentProps = {
  text: string
}

export type GetIterationCommentsReturnType = Promise<IterationCommentType[] | undefined>