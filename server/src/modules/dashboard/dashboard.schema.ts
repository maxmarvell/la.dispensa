import { z } from 'zod';

const baseUser = {
  id: z.string(),
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email(),
  username: z.string({
    required_error: 'Username is required',
  }).min(8, {
    message: "Username mist be at least 8 Characters"
  }).max(20, {
    message: "Username mist be at most 20 Characters"
  }),
};

const baseTags = {
  recipeId: z.string(),
  name: z.string(),
};

const baseRecipe = {
  id: z.string(),
  createdOn: z.nullable(z.date()),
  image: z.nullable(z.string()),
  title: z.string(),
  description: z.nullable(z.string()),
};

const recipeFeedResponse = z.array(
  z.object({
    author: z.object(baseUser),
    tags: z.array(z.object(baseTags)),
    ...baseRecipe
  })
);

export type RecipeFeedResponseType = z.infer<typeof recipeFeedResponse>;


