import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';


// create iteration
const createIterationCore = {
  recipeId: z.string(),
  tag: z.string().optional(),
  parentId: z.string().optional(),
};

const createIterationSchema = z.object(createIterationCore);

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
});

// update tag
const updateIterationSchema = z.object({
  tag: z.string().optional(),
});


// update ingredient
const updateIterationIngredeientSchema = z.object({
  unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
  quantity: z.number().optional()
});


// create many ingredients
const createIterationIngredientSchema = z.object({
  ingredient: z.object({
    name: z.string()
  }),
  unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
  quantity: z.number(),
});

const createManyIterationIngredientsSchema = z.array(createIterationIngredientSchema);

const createManyIterationIngredientsResponseSchema = z.array(z.object({
  ingredient: z.object({
    name: z.string(),
    id: z.string()
  }),
  unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
  quantity: z.number(),
  ingredientId: z.string(),
  iterationId: z.string(),
}));


// instructions
const instructionCore = {
  description: z.string(),
  timeAndTemperature: z.object({
    hours: z.number().optional(),
    minutes: z.number().optional(),
    temperature: z.number(),
    unit: z.enum(["C", "K"]).optional(),
  }).optional(),
  step: z.number()
};


// create many instructions
const createIterationInstructionSchema = z.object({
  ...instructionCore,
});

const createManyIterationInstructionsSchema = z.array(createIterationInstructionSchema);


// update instruction
const updateIterationInstructionSchema = z.object({
  timeAndTemperature: z.object({
    hours: z.number().optional(),
    minutes: z.number().optional(),
    temperature: z.number(),
    unit: z.enum(["C", "K"]).optional(),
  }).optional(),
  description: z.string().optional(),
});

const updateIterationInstructionResponseSchema = z.object({
  timeAndTemperature: z.object({
    hours: z.number().optional(),
    minutes: z.number().optional(),
    temperature: z.number(),
    unit: z.enum(["C", "K"]),
  }).optional(),
  description: z.string(),
  step: z.number(),
  iterationId: z.string(),
});


// create comment
const createIterationCommentSchema = z.object({
  text: z.string()
});

const createIterationCommentResponseSchema = z.object({
  text: z.string(),
  id: z.string(),
  createdOn: z.date(),
});


// utility

const findParentInstructionCore = {
  ...instructionCore,
  timeAndTemperature: z.object({
    hours: z.number().nullable(),
    minutes: z.number().nullable(),
    temperature: z.number(),
    unit: z.enum(["C", "K"]).nullable(),
  }).nullable(),
}

const findParentRecipeInstruction = z.object({
  ...findParentInstructionCore,
  recipeId: z.string()
});

const findParentIterationInstruction = z.object({
  ...findParentInstructionCore,
  iterationId: z.string()
});

const findIterationResponseSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  createdOn: z.date().nullable(),
  updatedAt: z.date().nullable(),
  ingredients: z.array(
    z.object({
      ingredientId: z.string(),
      iterationId: z.string(),
      quantity: z.number(),
      unit: z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).nullable()
    })
  ),
});

const iterationInstructionCompositeKey = z.object({
  step: z.number(),
  iterationId: z.string()
});


// iterations
export type CreateIterationInput = z.infer<typeof createIterationSchema>;
export type UpdateIterationInput = z.infer<typeof updateIterationSchema>;

// ingredients
export type CreateIterationIngredientInput = z.infer<typeof createIterationIngredientSchema>;
export type CreateManyIterationIngredientsInput = z.infer<typeof createManyIterationIngredientsSchema>;
export type UpdateIterationIngredientInput = z.infer<typeof updateIterationIngredeientSchema>;

// comments
export type CreateIterationCommentInput = z.infer<typeof createIterationCommentSchema>;

// instructions
export type CreateIterationInstructionInput = z.infer<typeof createIterationInstructionSchema>;
export type CreateManyIterationInstructionInput = z.infer<typeof createManyIterationInstructionsSchema>;
export type UpdateIterationInstructionInput = z.infer<typeof updateIterationInstructionSchema>;

// utility
export type ParentRecipeInstruction = z.infer<typeof findParentRecipeInstruction>;
export type ParentIterationInstruction = z.infer<typeof findParentIterationInstruction>;
export type FindIterationResponse = z.infer<typeof findIterationResponseSchema>;
export type IterationInstructionCompositeKey = z.infer<typeof iterationInstructionCompositeKey>


export const { schemas: iterationSchema, $ref } = buildJsonSchemas({
  createIterationSchema,
  createIterationResponseSchema,
  updateIterationSchema,

  updateIterationIngredeientSchema,
  createIterationIngredientSchema,
  createManyIterationIngredientsSchema,
  createManyIterationIngredientsResponseSchema,

  updateIterationInstructionSchema,
  updateIterationInstructionResponseSchema,
  createManyIterationInstructionsSchema,

  createIterationCommentSchema,
  createIterationCommentResponseSchema
}, { $id: "IterationSchema" });