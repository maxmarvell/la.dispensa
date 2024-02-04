"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.instructionSchemas = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const instructionCore = {
    description: zod_1.z.string(),
    step: zod_1.z.number(),
    timeAndTemperature: zod_1.z.object({
        hours: zod_1.z.number().optional(),
        minutes: zod_1.z.number().optional(),
        temperature: zod_1.z.number(),
        unit: zod_1.z.enum(["C", "K"]).optional(),
    }).optional(),
};
const createInstructionSchema = zod_1.z.object(Object.assign(Object.assign({}, instructionCore), { recipeId: zod_1.z.string() }));
const updateInstructionSchema = zod_1.z.object(Object.assign(Object.assign({}, instructionCore), { description: zod_1.z.string().optional(), step: zod_1.z.number().optional() }));
const updateInstructionResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, instructionCore), { description: zod_1.z.string().optional(), step: zod_1.z.number().optional(), id: zod_1.z.number(), recipeId: zod_1.z.number() }));
const createInstructionsSchema = zod_1.z.array(createInstructionSchema);
const createInstructionResponseSchema = zod_1.z.array(zod_1.z.object(Object.assign(Object.assign({}, instructionCore), { id: zod_1.z.string(), recipeId: zod_1.z.string() })));
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createInstructionSchema,
    createInstructionsSchema,
    createInstructionResponseSchema,
    updateInstructionSchema,
    updateInstructionResponseSchema,
}, { $id: "InstructionSchema" }), exports.instructionSchemas = _a.schemas, exports.$ref = _a.$ref;
