import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const recipeCore = {
  title: z.string({
    required_error: "A recipe requires a title"
  }),
};

const createRecipeSchema = z.object({
  ...recipeCore
});

const createRecipeResponseSchema = z.object({
  id: z.string(),
  authorId: z.string({
    required_error: "A recipe must have an author"
  }),
  ...recipeCore
});

const updateRecipeCore = {
  title: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional()
};

const updateRecipeSchema = z.object({
  ...updateRecipeCore
});

const updateRecipeResponseSchema = {
  ...updateRecipeCore,
  authorId: z.string({
    required_error: "A recipe must have an author"
  })
};

const componentCore = {
  componentId: z.string(),
  amount: z.number()
};

const connectComponentSchema = z.object({
  ...componentCore
});

const connectComponentResponseSchema = z.object({
  ...componentCore,
  RecipeComponentId : z.string()
})

const addEditorSchema = z.object({
  userId: z.string()
})


// Ratings

const createRatingSchema = z.object({
  userId: z.string(),
  value: z.number(),
})
const updateRatingSchema = z.object({
  value: z.number(),
})


// Reviews

const createReviewSchema = z.object({
  userId: z.string(),
  text: z.string(),
})
const updateReviewSchema = z.object({
  text: z.string()
})


// Tags

const updateTagsSchema = z.array(z.object({
    name: z.string()
})).max(3)


export type CreateRecipeInput = z.infer<typeof createRecipeSchema>
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>
export type ConnectComponentInput = z.infer<typeof connectComponentSchema>
export type AddEditorInput = z.infer<typeof addEditorSchema>
export type CreateRatingInput = z.infer<typeof createRatingSchema>
export type UpdateRatingInput = z.infer<typeof updateRatingSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
export type UpdateTagsInput = z.infer<typeof updateTagsSchema>


export const { schemas: recipeSchemas, $ref } = buildJsonSchemas({
  createRecipeSchema,
  createRecipeResponseSchema,
  updateRecipeSchema,
  connectComponentSchema,
  connectComponentResponseSchema,
  addEditorSchema,
  createRatingSchema,
  createReviewSchema,
  updateRatingSchema,
  updateReviewSchema,
  updateTagsSchema,
}, { $id: "RecipeSchema" });