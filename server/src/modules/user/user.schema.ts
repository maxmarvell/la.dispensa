import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod'


const userCore = {
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
}

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }).min(8, {
    message: "Username mist be at least 8 Characters"
  }).max(20, {
    message: "Username mist be at most 20 Characters"
  }),
});


const createUserResponseSchema = z.object({
  id: z.string(),
  ...userCore,
});

const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

const changePasswordSchema = z.object({
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
})

// utility
const findConnectionSchema = z.object({
  connectedWithId: z.string(),
  connectedById: z.string(),
  accepted: z.boolean(),
  createdOn: z.date().nullable(),
  connectedWith: z.object({
    username: z.string(),
    id: z.string(),
    image: z.string().nullable(),
  }),
  connectedBy: z.object({
    username: z.string(),
    id: z.string(),
    image: z.string().nullable(),
  })
});

const findProfileRecipeSchema = z.object({
  author: z.object({
    username: z.string(),
    id: z.string(),
  }),
  editors: z.array(
    z.object({
      user: z.object({
        username: z.string(),
        id: z.string(),
      }),
      recipeId: z.string(),
      userId: z.string(),
    })
  ),
  id: z.string(),
  createdOn: z.date().nullable(),
  updatedAt: z.date().nullable(),
  image: z.string().nullable(),
  public: z.boolean().nullable(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>

export type LoginInput = z.infer<typeof loginSchema>

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export type FindConnectionResponse = z.infer<typeof findConnectionSchema>

export type FindProfileRecipeResponse = z.infer<typeof findProfileRecipeSchema>


export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
  changePasswordSchema
}, { $id: "UserSchema" });