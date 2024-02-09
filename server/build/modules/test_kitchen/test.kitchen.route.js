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
const test_kitchen_controller_1 = require("./test.kitchen.controller");
const test_kitchen_schema_1 = require("./test.kitchen.schema");
function iterationRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/', {
            onRequest: [server.authenticate]
        }, test_kitchen_controller_1.getIterationsHandler),
            server.get('/:iterationId', {
                onRequest: [server.authenticate]
            }, test_kitchen_controller_1.getIterationInstanceHandler),
            server.post('/', {
                schema: {
                    body: (0, test_kitchen_schema_1.$ref)('createIterationSchema'),
                    response: {
                        201: (0, test_kitchen_schema_1.$ref)('createIterationResponseSchema')
                    },
                },
                onRequest: [server.authenticate]
            }, test_kitchen_controller_1.createIterationHandler);
        server.patch('/:iterationId/', {
            schema: {
                body: (0, test_kitchen_schema_1.$ref)('updateIterationSchema'),
                // response: {
                //   201: $ref('createManyIterationIngredientsResponseSchema')
                // }
            },
            onRequest: [server.authenticate]
        }, test_kitchen_controller_1.updateIterationHandler);
        server.post('/:iterationId/ingredients/', {
            schema: {
                body: (0, test_kitchen_schema_1.$ref)('createManyIterationIngredientsSchema'),
                response: {
                    201: (0, test_kitchen_schema_1.$ref)('createManyIterationIngredientsResponseSchema')
                }
            },
            onRequest: [server.authenticate]
        }, test_kitchen_controller_1.createManyIterationIngredientHandler);
        server.delete('/:iterationId/ingredients/:ingredientId/', {
            onRequest: [server.authenticate]
        }, test_kitchen_controller_1.deleteIterationIngredientHandler);
        server.patch('/:iterationId/ingredients/:ingredientId/', {
            schema: {
                body: (0, test_kitchen_schema_1.$ref)('updateIterationIngredeientSchema'),
            },
            onRequest: [server.authenticate]
        }, test_kitchen_controller_1.updateIterationIngredientHandler);
        server.patch('/:iterationId/instructions/:step/', {
            schema: {
                body: (0, test_kitchen_schema_1.$ref)('updateIterationInstructionSchema'),
                response: {
                    200: (0, test_kitchen_schema_1.$ref)('updateIterationInstructionResponseSchema')
                }
            },
            onRequest: [server.authenticate]
        }, test_kitchen_controller_1.updateIterationInstructionHandler);
    });
}
exports.default = iterationRoutes;
//# sourceMappingURL=test.kitchen.route.js.map