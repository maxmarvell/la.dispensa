import { FastifyReply, FastifyRequest } from "fastify";
import { UserPermissionParams, createPermission, getPermissions, getUserPermission } from "./permission.service";
import { CreatePermissionInput } from "./permission.schema";



export async function getPermissionsHandler(
  request: FastifyRequest<{
    Querystring: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { recipeId } = request.query;
    const permissions = await getPermissions(recipeId);
    return permissions
  } catch (error) {
    console.log(error);
    reply.code(404)
  }
}

export async function getUserPermissionHandler(
  request: FastifyRequest<{
    Params: UserPermissionParams
  }>,
  reply: FastifyReply
) {
  try {
    const permission = await getUserPermission(request.params)
    return permission
  } catch (error) {
    console.log(error);
    reply.code(404)
  }
}


export async function createPermissionHandler(
  request: FastifyRequest<{
    Body: CreatePermissionInput,
    Params: UserPermissionParams
  }>,
  reply: FastifyReply
) {
  try {
    const permission = await createPermission({
      ...request.body,
      ...request.params
    })
    return permission
  } catch (error) {
    console.log(error);
    reply.code(404)
  }
}