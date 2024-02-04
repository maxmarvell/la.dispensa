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
exports.removeIngredientHandler = exports.updateIngredientHandler = exports.createManyIngredientsHandler = exports.getIngredientsHandler = void 0;
const ingredient_service_1 = require("./ingredient.service");
function getIngredientsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredients = yield (0, ingredient_service_1.getIngredients)({ recipeId: request.query.recipeId });
            return ingredients;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.getIngredientsHandler = getIngredientsHandler;
;
function createManyIngredientsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredients = yield Promise.all(request.body.map((el) => {
                return new Promise(resolve => resolve((0, ingredient_service_1.createIngredient)(el)));
            }));
            return ingredients;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.createManyIngredientsHandler = createManyIngredientsHandler;
function updateIngredientHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { ingredientId, recipeId } = request.params;
            const ingredient = yield (0, ingredient_service_1.updateIngredient)(Object.assign(Object.assign({}, request.body), { ingredientId,
                recipeId }));
            return ingredient;
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
    });
}
exports.updateIngredientHandler = updateIngredientHandler;
function removeIngredientHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { ingredientId, recipeId } = request.params;
            const result = yield (0, ingredient_service_1.removeIngredient)(ingredientId, recipeId);
            return result;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.removeIngredientHandler = removeIngredientHandler;
