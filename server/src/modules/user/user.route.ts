import {
  registerUserHandler,
  loginHandler,
  getUsersHandler,
  getUserHandler,
  connectHandler,
  uploadPhotoHandler,
  getConnectionsHandler,
  acceptConnectionHandler,
  findGalleryRecipesHandler,
  changeUserPasswordHandler,
  removeConnectionHandler,
  getConnectionRequestsHandler,
  getConnectionsOfUserHandler
} from "./user.controller";

import { FastifyInstance, } from "fastify";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {

  server.post('/', {
    schema: {
      body: $ref('createUserSchema'),
      response: {
        201: $ref('createUserResponseSchema')
      }
    }
  }, registerUserHandler);

  server.post('/login', {
    schema: {
      body: $ref('loginSchema'),
      response: {
        200: $ref('loginResponseSchema')
      }
    }
  }, loginHandler);

  server.patch('/:userId/uploadPhoto/', {
    onRequest: [server.authenticate]
  }, uploadPhotoHandler);

  server.get('/', getUsersHandler);

  server.get('/:userId', getUserHandler);

  // Connections routes

  server.get('/connections', {
    onRequest: [server.authenticate]
  } ,getConnectionsHandler);

  server.get('/:userId/connections', getConnectionsOfUserHandler)

  server.post('/:userId/connect/', {
    onRequest: [server.authenticate]
  }, connectHandler);

  server.delete('/:userId/connect/', {
    onRequest: [server.authenticate]
  }, removeConnectionHandler);

  server.put('/:userId/connect/', {
    onRequest: [server.authenticate]
  }, acceptConnectionHandler);

  server.get('/connection-requests', {
    onRequest: [server.authenticate],
  }, getConnectionRequestsHandler);

  // Gallery

  server.get('/:userId/gallery', findGalleryRecipesHandler);

  // User setting services

  server.patch('/:userId/updatePassword/', {
    schema: {
      body: $ref('changePasswordSchema')
    }, 
    // onRequest: [server.authenticate]
  }, changeUserPasswordHandler);

}

export default userRoutes