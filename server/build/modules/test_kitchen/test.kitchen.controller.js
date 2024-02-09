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
exports.createManyIterationIngredientHandler = exports.updateIterationInstructionHandler = exports.updateIterationIngredientHandler = exports.deleteIterationIngredientHandler = exports.updateIterationHandler = exports.createIterationHandler = exports.getIterationInstanceHandler = exports.getIterationsHandler = void 0;
const test_kitchen_service_1 = require("./test.kitchen.service");
function getIterationsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { recipeId } = request.query;
            const iterations = yield (0, test_kitchen_service_1.getIterations)(recipeId);
            return iterations;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.getIterationsHandler = getIterationsHandler;
;
function getIterationInstanceHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { iterationId } = request.params;
            const iteration = yield (0, test_kitchen_service_1.getIterationInstance)(iterationId);
            return iteration;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.getIterationInstanceHandler = getIterationInstanceHandler;
;
function createIterationHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const iteration = yield (0, test_kitchen_service_1.createIteration)(Object.assign({}, request.body));
            return iteration;
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
    });
}
exports.createIterationHandler = createIterationHandler;
function updateIterationHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const iteration = yield (0, test_kitchen_service_1.updateIteration)(Object.assign(Object.assign({}, request.body), request.params));
            return iteration;
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
    });
}
exports.updateIterationHandler = updateIterationHandler;
function deleteIterationIngredientHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, test_kitchen_service_1.deleteIterationIngredient)(request.params);
            return result;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.deleteIterationIngredientHandler = deleteIterationIngredientHandler;
function updateIterationIngredientHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log({ ...request.params, ...request.body })
            const result = yield (0, test_kitchen_service_1.updateIterationIngredient)(Object.assign(Object.assign({}, request.params), request.body));
            return result;
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
        ;
    });
}
exports.updateIterationIngredientHandler = updateIterationIngredientHandler;
;
function updateIterationInstructionHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(Object.assign(Object.assign({}, request.params), request.body));
            const result = yield (0, test_kitchen_service_1.updateIterationInstruction)(Object.assign(Object.assign({}, request.params), request.body));
            return result;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.updateIterationInstructionHandler = updateIterationInstructionHandler;
function createManyIterationIngredientHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredients = yield Promise.all(request.body.map((el) => {
                return new Promise(resolve => resolve((0, test_kitchen_service_1.createIterationingredient)(Object.assign(Object.assign({}, el), request.params))));
            }));
            return ingredients;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.createManyIterationIngredientHandler = createManyIterationIngredientHandler;
//# sourceMappingURL=test.kitchen.controller.js.map