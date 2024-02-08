import { FastifyInstance } from "fastify";
import { $ref } from "./recipe.schema";
import { addEditorHandler, connectComponentHandler, createRecipeHandler, createReviewHandler, getAvailableComponentsHandler, getComponentsHandler, getEditorsHandler, getRecipeHandler, getRecipesHandler, getReviewsHandler, removeConnectComponentHandler, removeEditorHandler, removeRecipeHandler, updateRecipeHandler, createRatingHandler, getRatingsHandler, getRatingHandler, updateRatingHandler, getReviewHandler, updateReviewHandler, updateTagsHandler, findTestKitchenRecipesHandler, getDashboardHandler } from "./recipe.controller";
import { uploadPhotoHandler } from "./recipe.controller";



async function recipeRoutes(server: FastifyInstance) {

  server.get('/', {
    onRequest: [server.authenticate]
  }, getRecipesHandler);

  server.post('/', {
    schema: {
      body: $ref('createRecipeSchema'),
      response: {
        201: $ref('createRecipeResponseSchema')
      }
    },
    onRequest: [server.authenticate],
  }, createRecipeHandler);


  server.get('/:recipeId', {
    onRequest: [server.authenticate]
  }, getRecipeHandler);


  server.patch('/:recipeId/', {
    schema: {
      body: $ref('updateRecipeSchema'),
      response: {
        201: $ref('createRecipeResponseSchema')
      }
    },
    onRequest: [server.authenticate]
  }, updateRecipeHandler);

  server.delete('/:recipeId/', {
    onRequest: [server.authenticate]
  }, removeRecipeHandler);

  server.patch('/:recipeId/uploadPhoto/', {
    onRequest: [server.authenticate]
  }, uploadPhotoHandler);


  server.get('/:recipeId/components', {
    onRequest: [server.authenticate]
  }, getComponentsHandler)

  server.post('/:recipeId/components/', {
    schema: {
      body: $ref('connectComponentSchema'),
      response: {
        201: $ref('connectComponentResponseSchema')
      }
    },
    onRequest: [server.authenticate]
  }, connectComponentHandler)

  server.delete('/:recipeId/components/:componentId/', {
    onRequest: [server.authenticate]
  }, removeConnectComponentHandler)


  server.get('/:recipeId/availComponents', {
    onRequest: [server.authenticate]
  }, getAvailableComponentsHandler)


  server.get('/:recipeId/editors', {
    onRequest: [server.authenticate]
  }, getEditorsHandler)


  server.post('/:recipeId/editors/', {
    onRequest: [server.authenticate],
    schema: {
      body: $ref('addEditorSchema')
    }
  }, addEditorHandler)

  server.delete('/:recipeId/editors/:userId/', {
    onRequest: [server.authenticate]
  }, removeEditorHandler)


  // Reviews

  server.get('/:recipeId/reviews', {
    onRequest: [server.authenticate],
  }, getReviewsHandler)

  server.post('/:recipeId/reviews/', {
    onRequest: [server.authenticate],
    schema: {
      body: $ref('createReviewSchema')
    }
  }, createReviewHandler)

  server.get('/:recipeId/reviews/:userId', {
    onRequest: [server.authenticate]
  }, getReviewHandler)

  server.put('/:recipeId/reviews/:userId/', {
    onRequest: [server.authenticate],
    schema: {
      body: $ref('updateReviewSchema')
    }
  }, updateReviewHandler)


  // Ratings

  server.get('/:recipeId/ratings', {
    onRequest: [server.authenticate],
  }, getRatingsHandler)

  server.get('/:recipeId/ratings/:userId', {
    onRequest: [server.authenticate]
  }, getRatingHandler)

  server.put('/:recipeId/ratings/:userId/', {
    onRequest: [server.authenticate],
    schema: {
      body: $ref('updateRatingSchema')
    },
  }, updateRatingHandler)

  server.post('/:recipeId/ratings/', {
    onRequest: [server.authenticate],
    schema: {
      body: $ref('createRatingSchema')
    }
  }, createRatingHandler)


  // Tags

  server.put('/:recipeId/tags/', {
    onRequest: [server.authenticate],
    schema: {
      body: $ref("updateTagsSchema")
    }
  }, updateTagsHandler)


  // Test Kitchen

  server.get('/test-kitchen',{
    onRequest: [server.authenticate]
  }, findTestKitchenRecipesHandler)


  // Dashboard

  server.get('dashboard', getDashboardHandler)

};

export default recipeRoutes