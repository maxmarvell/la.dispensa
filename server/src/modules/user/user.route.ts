import {
  registerUserHandler,
  loginHandler,
  getUsersHandler,
  getUserHandler,
  connectHandler,
  connectDeleteHandler,
  uploadPhotoHandler,
  getConnectionsHandler,
  acceptConnectionHandler,
  findGalleryRecipesHandler,
  getConnectedByHandler,
  changeUserPasswordHandler
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
  }, uploadPhotoHandler)


  server.get('/', getUsersHandler);

  server.get('/:userId', getUserHandler);


  // Connections routes

  server.post('/:userId/connections/', {
    schema: {
      body: $ref('connectionRequestSchema'),
      response: {
        200: $ref('connectionResponseSchema')
      }
    },
    onRequest: [server.authenticate]
  }, connectHandler)

  server.delete('/:userId/connectections/:connectedWithId', {
    onRequest: [server.authenticate]
  }, connectDeleteHandler)

  server.get('/:userId/connections', getConnectionsHandler)

  server.get('/:userId/connected-by', getConnectedByHandler)

  server.patch('/:userId/connections/:connectedById/', {
    onRequest: [server.authenticate]
  }, acceptConnectionHandler)

  // Gallery

  server.get('/:userId/gallery', findGalleryRecipesHandler)


  // User setting services

  server.patch('/updatePassword/', {
    schema: {
      body: $ref('changePasswordSchema')
    }, 
    onRequest: [server.authenticate]
  }, changeUserPasswordHandler)

}

export default userRoutes