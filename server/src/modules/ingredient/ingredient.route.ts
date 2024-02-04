import { FastifyInstance } from "fastify";
import { getIngredientsHandler, removeIngredientHandler, updateIngredientHandler } from "./ingredient.controller";
import { $ref } from "./ingredient.schema";
import { createManyIngredientsHandler } from "./ingredient.controller";

async function ingredientRoutes(server: FastifyInstance) {
  
  server.get('/', getIngredientsHandler)


  server.post('/', {
    schema: {
      body: $ref('createManyIngredientSchema'),
      response: {
        201: $ref('createManyIngredientResponseSchema')
      }
    },
    onRequest: [server.authenticate]
  }, createManyIngredientsHandler)


  server.patch('/:recipeId/:ingredientId/', {
    schema: {
      body: $ref('updateIngredientSchema'),
      response: {
        201: $ref('updateIngredientResponseSchema'),
      }
    },
    onRequest: [server.authenticate]
  }, updateIngredientHandler)

  server.delete('/:recipeId/:ingredientId/', {
    onRequest: [server.authenticate]
  }, removeIngredientHandler)

};


export default ingredientRoutes;