import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const instructionCore = {
  description: z.string(),
  step: z.number(),
  timeAndTemperature: z.object({
    hours: z.number().optional(),
    minutes: z.number().optional(),
    temperature: z.number(),
    unit: z.enum(["C", "K"]).optional(),
  }).optional(),
}

const createInstructionSchema = z.object({
  ...instructionCore,
  recipeId: z.string()
})

const updateInstructionSchema = z.object({
  ...instructionCore,
  description: z.string().optional(),
  step: z.number().optional(),
})

const updateInstructionResponseSchema = z.object({
  ...instructionCore,
  description: z.string().optional(),
  step: z.number().optional(),
  id: z.number(),
  recipeId: z.number()
})

const createInstructionsSchema = z.array(createInstructionSchema)

const createInstructionResponseSchema = z.array(z.object({
  ...instructionCore,
  id: z.string(),
  recipeId: z.string(),
}))

export type CreateInstructionInput = z.infer<typeof createInstructionSchema>
export type CreateInstructionsInput = z.infer<typeof createInstructionsSchema>
export type UpdateInstructionInput = z.infer<typeof updateInstructionSchema>

export const { schemas: instructionSchemas, $ref } = buildJsonSchemas({
  createInstructionSchema,
  createInstructionsSchema,
  createInstructionResponseSchema,
  updateInstructionSchema,
  updateInstructionResponseSchema,
}, { $id: "InstructionSchema" });