import { FastifyInstance } from "fastify";
import { createIterationCommentHandler, createIterationHandler, createManyIterationIngredientHandler, createManyIterationInstructionsHandler, deleteIterationIngredientHandler, deleteIterationInstructionHandler, getCommentsHandler, getIterationInstanceHandler, getIterationsHandler, updateIterationHandler, updateIterationIngredientHandler, updateIterationInstructionHandler } from "./test.kitchen.controller";
import { $ref } from "./test.kitchen.schema";


async function iterationRoutes(server: FastifyInstance) {

  server.get('/', {
    onRequest: [server.authenticate]
  }, getIterationsHandler);

  server.get('/:iterationId', {
    onRequest: [server.authenticate]
  }, getIterationInstanceHandler);

  server.post('/', {
    schema: {
      body: $ref('createIterationSchema'),
      response: {
        201: $ref('createIterationResponseSchema')
      },
    },
    onRequest: [server.authenticate]
  }, createIterationHandler);
  
  server.patch('/:iterationId/', {
    schema: {
      body: $ref('updateIterationSchema'),
      // response: {
      //   201: $ref('createManyIterationIngredientsResponseSchema')
      // }
    },
    onRequest: [server.authenticate]
  }, updateIterationHandler);

  server.post('/:iterationId/ingredients/', {
    schema: {
      body: $ref('createManyIterationIngredientsSchema'),
      response: {
        201: $ref('createManyIterationIngredientsResponseSchema')
      }
    }, 
    onRequest: [server.authenticate]
  }, createManyIterationIngredientHandler);

  server.delete('/:iterationId/ingredients/:ingredientId/', {
    onRequest: [server.authenticate]
  }, deleteIterationIngredientHandler);

  server.patch('/:iterationId/ingredients/:ingredientId/', {
    schema: {
      body: $ref('updateIterationIngredeientSchema'),
    },
    onRequest: [server.authenticate]
  }, updateIterationIngredientHandler);

  // Instructions

  server.post('/:iterationId/instructions/', {
    schema: {
      body: $ref('createManyIterationInstructionsSchema')
    },
    onRequest: [server.authenticate]
  }, createManyIterationInstructionsHandler);

  server.patch('/:iterationId/instructions/:step/', {
    schema: {
      body: $ref('updateIterationInstructionSchema'),
      response: {
        200: $ref('updateIterationInstructionResponseSchema')
      }
    },
    onRequest: [server.authenticate]
  }, updateIterationInstructionHandler);

  server.delete('/:iterationId/instructions/:step/', {
    onRequest: [server.authenticate]
  }, deleteIterationInstructionHandler)

  // Comments

  server.get('/:iterationId/comments', {
    onRequest: [server.authenticate]
  }, getCommentsHandler);

  server.post('/:iterationId/comments/', {
    onRequest: [server.authenticate],
    schema: {
      body: $ref('createIterationCommentSchema')
    }
  }, createIterationCommentHandler);
  
}

export default iterationRoutes