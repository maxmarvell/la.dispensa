import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod'


const userCore = {
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email(),
  username: z.string(),
}

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
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


const connectionRequestSchema = z.object({
  connectedWithId: z.string(),
  connectedById: z.string(),
})

const connectionResponseSchema = z.object({
  connectedWithId: z.string(),
  connectedById: z.string(),
  accepted: z.boolean(),
})


export type CreateConnectionInput = z.infer<typeof connectionRequestSchema>

export type CreateUserInput = z.infer<typeof createUserSchema>

export type LoginInput = z.infer<typeof loginSchema>


export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
  connectionRequestSchema,
  connectionResponseSchema
}, { $id: "UserSchema" });