import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const permissionCore = {
  role: z.enum(["VIEWER", "CONTRIBUTOR", "EDITOR"]),
}

const createPermissionSchema = z.object(permissionCore)

const createPermissionResponseSchema = z.object({
  ...permissionCore,
  userId: z.string(),
  recipeId: z.string(),
})

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>

export const { schemas: permissionSchema, $ref } = buildJsonSchemas({
  createPermissionSchema,
  createPermissionResponseSchema,
}, { $id: "PermissionSchema" });