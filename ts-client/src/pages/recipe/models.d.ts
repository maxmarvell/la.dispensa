import { BaseIngredientType } from "@/types/ingredient"
import { BaseEditorType, BaseRecipeIngredientType, BaseRecipeInstructionType, BaseRecipeType, AggregatedRatingsType, BaseReview, BaseRating } from "@/types/recipe"
import { InputRecipeIngredientType } from "@/types/recipe-ingredient"
import { BaseTagType } from "@/types/tag"
import { BaseUserType } from "@/types/user"

export interface DetailedRecipeType extends BaseRecipeType {
  tags: BaseTagType[]
  author: BaseUserType
  ingredients: BaseRecipeIngredientType[]
  instructions: BaseRecipeInstructionType[]
}

export type ComponentType = {
  recipeId: string
  componentId: string
  amount: number
  component: DetailedRecipeType
}

export interface AdvancedRecipeType extends DetailedRecipeType {
  components: ComponentType[]
  editors: BaseEditorType[]
}

// component props
export type RecipeLandingProps = {
  reviewsRef: React.RefObject<HTMLDivElement>,
  recipeRef: React.RefObject<HTMLDivElement>,
}

export type IngredientFieldProps = {
  ingredient: BaseRecipeIngredientType
}

export type CreateIngredientFieldProps = {
  newIngredient: BaseIngredientType<{index: number}>,
  setNewIngredient: (value: React.SetStateAction<BaseIngredientType<{index: number}>[]>) => void
};

// use recipe
export type UseRecipeProps = {
  recipeId?: string
}

export type UseRecipeReturnType = Promise<AdvancedRecipeType | undefined>
export type UseAggregatedRecipeReturnType = Promise<AggregatedRatingsType | undefined>

// use update recipe photo
export type UseUpdateRecipePictureInput = {
  input: FormData
}

// use update recipe title
export type UseUpdateRecipeProps = {
  title?: string
  description?: string
}

export type UseUpdateTagsProps = {
  tags?: { name: string }[]
}

// reviews
export type UseReviewProps = {
  recipeId?: string
  userId?: string
}

export type GetReviewReturnType = Promise<BaseReview | undefined>
export type GetManyReviewsReturnType = Promise<BaseReview[] | undefined>

export type CreateReviewProps = {
  text: string
}

export type UpdateReviewProps = {
  text: string
}

// ratings
export type UseRatingProps = {
  recipeId?: string
  userId?: string
}
export type GetRatingReturnType = Promise<BaseRating | undefined>
export type CreateRatingProps = {
  value: number
}
export type UpdateRatingProps = {
  value: number
}

// ingredients
export type UseIngredientProps = {
  recipeId?: string
}

export type GetIngredientsReturnType = Promise<{
  ingredients: BaseRecipeIngredientType[]
  components: ComponentType[]
} | undefined>

export type CreateIngredientsProps = {
  input: InputRecipeIngredientType[]
}

export type UpdateIngredientProps = {
  ingredientId: string,
  input: Partial<InputRecipeIngredientType>
}

export type RemoveIngredientProps = {
  ingredientId: string
}




// preparations
export type InstructionFieldProps = {
  instruction: BaseRecipeInstructionType
}

export type UseInstructionProps = {
  recipeId?: string
}

export type  InstructionInputType = {
  description: string
  timeAndTemperature?: TimeAndTemperatureType
}

export type CreatePreparationPropsType = {
  instruction: BaseRecipeInstructionType
  setNewInstructions: React.Dispatch<React.SetStateAction<BaseRecipeInstructionType[]>>
}

export type UpdatePreparationProps = {
  instruction: BaseRecipeInstructionType
}

export type GetInstructionsReturnType = Promise<{
  instructions: BaseRecipeInstructionType[]
  components: DetailedRecipeType[]
} | undefined>

export type CreateManyInstructionProps = {
  input: BaseRecipeInstructionType[]
}

export type UpdateInstructionProps = {
  input: InstructionInputType
  step: number
}

export type RemoveInstructionProps = {
  step: number
}
