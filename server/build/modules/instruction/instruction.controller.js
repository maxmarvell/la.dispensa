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
exports.deleteInstructionHandler = exports.updateInstructionHandler = exports.createManyInstructionsHandler = exports.getInstructionsHandler = void 0;
const instruction_service_1 = require("./instruction.service");
function getInstructionsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const instructions = yield (0, instruction_service_1.getInstructions)(request.query.recipeId);
            return instructions;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
            ;
        }
    });
}
exports.getInstructionsHandler = getInstructionsHandler;
function createManyInstructionsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const instructions = yield Promise.all(request.body.map((el) => {
                return new Promise(resolve => resolve((0, instruction_service_1.createInstruction)(el)));
            }));
            return instructions;
        }
        catch (e) {
            console.log(e);
            return reply.code(400);
        }
    });
}
exports.createManyInstructionsHandler = createManyInstructionsHandler;
function updateInstructionHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(request.body);
            const instructions = yield (0, instruction_service_1.updateInstruction)(Object.assign(Object.assign({}, request.body), request.params));
            return instructions;
        }
        catch (e) {
            console.log(e);
            return reply.code(400);
        }
    });
}
exports.updateInstructionHandler = updateInstructionHandler;
function deleteInstructionHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, instruction_service_1.deleteInstruction)(request.params);
            return response;
        }
        catch (e) {
            console.log(e);
            return reply.code(400);
        }
    });
}
exports.deleteInstructionHandler = deleteInstructionHandler;
//# sourceMappingURL=instruction.controller.js.map