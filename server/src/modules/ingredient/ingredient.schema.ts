import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';


const ingredientCore = {
  recipeId: z.string(),
  ingredient: z.object({
    name: z.string()
  }),
  unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
  quantity: z.number()
}

const createIngredientSchema = z.object(ingredientCore);

const createManyIngredientSchema = z.array(createIngredientSchema);

const createManyIngredientResponseSchema = z.array(
  z.object({
    ...ingredientCore,
    id: z.string(),
  })
)

const updateIngredientCore = {
  ingredient: z.object({
    name: z.string()
  }),
  unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
  quantity: z.number(),
}

const updateIngredientSchema = z.object({
  ...updateIngredientCore
});

const updateIngredientResponseSchema = z.object({
  ...updateIngredientCore,
  ingreidentId: z.string(),
  recipeId: z.string(),
})

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>
export type CreateManyIngredientInput = z.infer<typeof createManyIngredientSchema>
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>

export const { schemas: ingredientSchemas, $ref } = buildJsonSchemas({
  createIngredientSchema,
  createManyIngredientSchema,
  createManyIngredientResponseSchema,
  updateIngredientSchema,
  updateIngredientResponseSchema
}, { $id: "IngredientSchema" });