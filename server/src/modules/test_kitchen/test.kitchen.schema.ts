import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const createIterationCore = {
  recipeId: z.string(),
  tag: z.string().optional(),
  parentId: z.string().optional(),
}

const createIterationSchema = z.object(createIterationCore)

const createIterationResponseSchema = z.object({
  ...createIterationCore,
  ingredients: z.array(z.object({
    iterationId: z.string(),
    ingredientId: z.string(),
    quantity: z.number(),
    unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
    ingredient: z.object({
      name: z.string(),
      id: z.string(),
    })
  })),
  instructions: z.array(z.object({
    description: z.string(),
    step: z.number(),
    time: z.object({
      hours: z.number().optional(),
      minutes: z.number().optional()
    }).optional(),
    temperature: z.object({
      temperature: z.number().optional(),
      unit: z.enum(["C", "K"]).optional(),
    }).optional(),
    iterationId: z.string()
  })),
  id: z.string(),
  createdOn: z.date(),
  updatedAt: z.date(),
})

const updateIterationSchema = z.object({
  tag: z.string().optional(),
})

const updateIterationIngredeientSchema = z.object({
  unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
  quantity: z.number().optional()
})

const createIterationIngredientSchema = z.object({
  ingredient: z.object({
    name: z.string()
  }),
  unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
  quantity: z.number(),
})

const createManyIterationIngredientsSchema = z.array(createIterationIngredientSchema)

const createManyIterationIngredientsResponseSchema = z.array(z.object({
  ingredient: z.object({
    name: z.string(),
    id: z.string()
  }),
  unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
  quantity: z.number(),
  ingredientId: z.string(),
  iterationId: z.string(),
}))

const updateIterationInstructionSchema = z.object({
  time: z.object({
    hours: z.number().optional(),
    minutes: z.number().optional()
  }),
  temperature: z.object({
    temperature: z.number().optional(),
    unit: z.enum(["C", "K"]).optional(),
  }),
})

const updateIterationInstructionResponseSchema = z.object({
  time: z.object({
    hours: z.number().optional(),
    minutes: z.number().optional()
  }),
  temperature: z.object({
    temperature: z.number().optional(),
    unit: z.enum(["C", "K"]).optional(),
  }),
  description: z.string(),
  step: z.number(),
  iterationId: z.string(),
})


export type CreateIterationInput = z.infer<typeof createIterationSchema>
export type UpdateIterationInput = z.infer<typeof updateIterationSchema>
export type UpdateIterationIngredientInput = z.infer<typeof updateIterationIngredeientSchema>
export type CreateManyIterationIngredientsInput = z.infer<typeof createManyIterationIngredientsSchema>
export type CreateIterationIngredientInput = z.infer<typeof createIterationIngredientSchema>
export type UpdateIterationInstructionInput = z.infer<typeof updateIterationInstructionSchema>


export const { schemas: iterationSchema, $ref } = buildJsonSchemas({
  createIterationSchema,
  createIterationResponseSchema,
  updateIterationSchema,
  updateIterationIngredeientSchema,
  createIterationIngredientSchema,
  createManyIterationIngredientsSchema,
  createManyIterationIngredientsResponseSchema,
  updateIterationInstructionSchema,
  updateIterationInstructionResponseSchema
}, { $id: "IterationSchema" });