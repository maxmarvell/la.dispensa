import { FastifyInstance } from "fastify";
// import { createIterationHandler, createManyIterationIngredientHandler, deleteIterationIngredientHandler, getIterationInstanceHandler, getIterationsHandler, updateIterationHandler, updateIterationIngredientHandler, updateIterationInstructionHandler } from "./test.kitchen.controller";
import { $ref } from "./test.kitchen.schema";

async function iterationRoutes(server: FastifyInstance) {

  // server.get('/', {
  //   onRequest: [server.authenticate]
  // }, getIterationsHandler),

  // server.get('/:iterationId', {
  //   onRequest: [server.authenticate]
  // }, getIterationInstanceHandler),

  // server.post('/', {
  //   schema: {
  //     body: $ref('createIterationSchema'),
  //     response: {
  //       201: $ref('createIterationResponseSchema')
  //     },
  //   },
  //   onRequest: [server.authenticate]
  // }, createIterationHandler)
  
  // server.patch('/:iterationId/', {
  //   schema: {
  //     body: $ref('updateIterationSchema'),
  //     // response: {
  //     //   201: $ref('createManyIterationIngredientsResponseSchema')
  //     // }
  //   },
  //   onRequest: [server.authenticate]
  // }, updateIterationHandler)

  // server.post('/:iterationId/ingredients/', {
  //   schema: {
  //     body: $ref('createManyIterationIngredientsSchema'),
  //     response: {
  //       201: $ref('createManyIterationIngredientsResponseSchema')
  //     }
  //   }, 
  //   onRequest: [server.authenticate]
  // }, createManyIterationIngredientHandler)

  // server.delete('/:iterationId/ingredients/:ingredientId/', {
  //   onRequest: [server.authenticate]
  // }, deleteIterationIngredientHandler)

  // server.patch('/:iterationId/ingredients/:ingredientId/', {
  //   schema: {
  //     body: $ref('updateIterationIngredeientSchema'),
  //   },
  //   onRequest: [server.authenticate]
  // }, updateIterationIngredientHandler)

  // server.patch('/:iterationId/instructions/:step/', {
  //   schema: {
  //     body: $ref('updateIterationInstructionSchema'),
  //     response: {
  //       200: $ref('updateIterationInstructionResponseSchema')
  //     }
  //   },
  //   onRequest: [server.authenticate]
  // }, updateIterationInstructionHandler)
}

export default iterationRoutes