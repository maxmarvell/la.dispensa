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
const ingredient_controller_1 = require("./ingredient.controller");
const ingredient_schema_1 = require("./ingredient.schema");
const ingredient_controller_2 = require("./ingredient.controller");
function ingredientRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/', ingredient_controller_1.getIngredientsHandler);
        server.post('/', {
            schema: {
                body: (0, ingredient_schema_1.$ref)('createManyIngredientSchema'),
                response: {
                    201: (0, ingredient_schema_1.$ref)('createManyIngredientResponseSchema')
                }
            },
            onRequest: [server.authenticate]
        }, ingredient_controller_2.createManyIngredientsHandler);
        server.patch('/:recipeId/:ingredientId/', {
            schema: {
                body: (0, ingredient_schema_1.$ref)('updateIngredientSchema'),
                response: {
                    201: (0, ingredient_schema_1.$ref)('updateIngredientResponseSchema'),
                }
            },
            onRequest: [server.authenticate]
        }, ingredient_controller_1.updateIngredientHandler);
        server.delete('/:recipeId/:ingredientId/', {
            onRequest: [server.authenticate]
        }, ingredient_controller_1.removeIngredientHandler);
    });
}
;
exports.default = ingredientRoutes;
