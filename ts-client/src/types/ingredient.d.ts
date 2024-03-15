export interface BaseIngredientNameType {
  name: string,
  id: string
}

export interface BaseIngredientType {
  ingredientId: string
  quantity: number
  unit?: "G" | "KG" | "CUP" | "ML" | "L" | "OZ"
  ingredient: BaseIngredientNameType
}

export interface NewIngredientInputType {
  quantity: number
  unit?: "G" | "KG" | "CUP" | "ML" | "L" | "OZ"
  ingredient: {
    name: string
  }
  id?: string
}