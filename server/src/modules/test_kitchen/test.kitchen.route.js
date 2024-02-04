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
function iterationRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.default = iterationRoutes;
