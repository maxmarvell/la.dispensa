import prisma from "../../utils/prisma";
import { CreatePermissionInput } from "./permission.schema";


export async function getPermissions(recipeId: string) {
  return prisma.recipePermission.findMany({
    where: {
      recipeId
    }
  })
}

export interface UserPermissionParams {
  userId: string,
  recipeId: string
}

export async function getUserPermission({ userId, recipeId }: UserPermissionParams) {
  return prisma.recipePermission.findUnique({
    where: {
      PermissionId: { recipeId, userId }
    }
  })
}


export async function createPermission(input: CreatePermissionInput & UserPermissionParams) {

  const { recipeId, userId, ...role } = input;

  return prisma.recipePermission.upsert({
    where: {
      PermissionId: { recipeId, userId }
    },
    update: role,
    create: input
  })
}