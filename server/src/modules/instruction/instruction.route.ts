
import { FastifyInstance } from "fastify"
import { $ref } from "./instruction.schema";
import { getInstructionsHandler, updateInstructionHandler, createManyInstructionsHandler, deleteInstructionHandler } from "./instruction.controller";


async function instructionRoutes(server: FastifyInstance) {

  server.get('/', getInstructionsHandler);


  server.post('/', {
    schema: {
      body: $ref('createInstructionsSchema'),
      response: {
        201: $ref('createInstructionResponseSchema')
      }
    },
    onRequest: [server.authenticate]
  }, createManyInstructionsHandler)


  server.patch('/:recipeId/:step', {
    schema: {
      body: $ref('updateInstructionSchema'),
      response: {
        201: $ref('updateInstructionResponseSchema')
      }
    },
    onRequest: [server.authenticate],
  }, updateInstructionHandler)


  server.delete('/:recipeId/:step', {
    onRequest: [server.authenticate]
  }, deleteInstructionHandler)

}

export default instructionRoutes;
