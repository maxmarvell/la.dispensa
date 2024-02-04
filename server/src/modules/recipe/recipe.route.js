"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipe_schema_1 = require("./recipe.schema");
const recipe_controller_1 = require("./recipe.controller");
const recipe_controller_2 = require("./recipe.controller");
function recipeRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.getRecipesHandler);
        server.post('/', {
            schema: {
                body: (0, recipe_schema_1.$ref)('createRecipeSchema'),
                response: {
                    201: (0, recipe_schema_1.$ref)('createRecipeResponseSchema')
                }
            },
            onRequest: [server.authenticate],
        }, recipe_controller_1.createRecipeHandler);
        server.get('/:recipeId', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.getRecipeHandler);
        server.patch('/:recipeId/', {
            schema: {
                body: (0, recipe_schema_1.$ref)('updateRecipeSchema'),
                response: {
                    201: (0, recipe_schema_1.$ref)('createRecipeResponseSchema')
                }
            },
            onRequest: [server.authenticate]
        }, recipe_controller_1.updateRecipeHandler);
        server.delete('/:recipeId/', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.removeRecipeHandler);
        server.patch('/:recipeId/uploadPhoto/', {
            onRequest: [server.authenticate]
        }, recipe_controller_2.uploadPhotoHandler);
        server.get('/:recipeId/components', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.getComponentsHandler);
        server.post('/:recipeId/components/', {
            schema: {
                body: (0, recipe_schema_1.$ref)('connectComponentSchema'),
                response: {
                    201: (0, recipe_schema_1.$ref)('connectComponentResponseSchema')
                }
            },
            onRequest: [server.authenticate]
        }, recipe_controller_1.connectComponentHandler);
        server.delete('/:recipeId/components/:componentId/', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.removeConnectComponentHandler);
        server.get('/:recipeId/availComponents', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.getAvailableComponentsHandler);
        server.get('/:recipeId/editors', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.getEditorsHandler);
        server.post('/:recipeId/editors/', {
            onRequest: [server.authenticate],
            schema: {
                body: (0, recipe_schema_1.$ref)('addEditorSchema')
            }
        }, recipe_controller_1.addEditorHandler);
        server.delete('/:recipeId/editors/:userId/', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.removeEditorHandler);
        // Reviews
        server.get('/:recipeId/reviews', {
            onRequest: [server.authenticate],
        }, recipe_controller_1.getReviewsHandler);
        server.post('/:recipeId/reviews/', {
            onRequest: [server.authenticate],
            schema: {
                body: (0, recipe_schema_1.$ref)('createReviewSchema')
            }
        }, recipe_controller_1.createReviewHandler);
        server.get('/:recipeId/reviews/:userId', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.getReviewHandler);
        server.put('/:recipeId/reviews/:userId/', {
            onRequest: [server.authenticate],
            schema: {
                body: (0, recipe_schema_1.$ref)('updateReviewSchema')
            }
        }, recipe_controller_1.updateReviewHandler);
        // Ratings
        server.get('/:recipeId/ratings', {
            onRequest: [server.authenticate],
        }, recipe_controller_1.getRatingsHandler);
        server.get('/:recipeId/ratings/:userId', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.getRatingHandler);
        server.put('/:recipeId/ratings/:userId/', {
            onRequest: [server.authenticate],
            schema: {
                body: (0, recipe_schema_1.$ref)('updateRatingSchema')
            },
        }, recipe_controller_1.updateRatingHandler);
        server.post('/:recipeId/ratings/', {
            onRequest: [server.authenticate],
            schema: {
                body: (0, recipe_schema_1.$ref)('createRatingSchema')
            }
        }, recipe_controller_1.createRatingHandler);
        // Tags
        server.put('/:recipeId/tags/', {
            onRequest: [server.authenticate],
            schema: {
                body: (0, recipe_schema_1.$ref)("updateTagsSchema")
            }
        }, recipe_controller_1.updateTagsHandler);
        // Test Kitchen
        server.get('/test-kitchen', {
            onRequest: [server.authenticate]
        }, recipe_controller_1.findTestKitchenRecipesHandler);
    });
}
;
exports.default = recipeRoutes;
