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
const instruction_schema_1 = require("./instruction.schema");
const instruction_controller_1 = require("./instruction.controller");
function instructionRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/', {
            onRequest: [server.authenticate]
        }, instruction_controller_1.getInstructionsHandler);
        server.post('/', {
            schema: {
                body: (0, instruction_schema_1.$ref)('createInstructionsSchema'),
                response: {
                    201: (0, instruction_schema_1.$ref)('createInstructionResponseSchema')
                }
            },
            onRequest: [server.authenticate]
        }, instruction_controller_1.createManyInstructionsHandler);
        server.patch('/:recipeId/:step', {
            schema: {
                body: (0, instruction_schema_1.$ref)('updateInstructionSchema'),
                response: {
                    201: (0, instruction_schema_1.$ref)('updateInstructionResponseSchema')
                }
            },
            onRequest: [server.authenticate],
        }, instruction_controller_1.updateInstructionHandler);
        server.delete('/:recipeId/:step', {
            onRequest: [server.authenticate]
        }, instruction_controller_1.deleteInstructionHandler);
    });
}
exports.default = instructionRoutes;
