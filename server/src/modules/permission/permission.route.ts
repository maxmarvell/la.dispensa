import { FastifyInstance } from "fastify";
import { createPermissionHandler, getPermissionsHandler, getUserPermissionHandler } from "./permission.controller";
import { $ref } from "./permission.schema";

async function permissionRoutes(server: FastifyInstance) {

  server.get('/', {
    onRequest: [server.authenticate]
  }, getPermissionsHandler)

  server.post('/:recipeId/:userId/', {
    schema: {
      body: $ref('createPermissionSchema'),
      response: {
        201: $ref('createPermissionResponseSchema')
      }
    },
    onRequest: [server.authenticate]
  }, createPermissionHandler)

  server.get('/:recipeId/:userId', {
    onRequest: [server.authenticate]
  }, getUserPermissionHandler)

};


export default permissionRoutes;