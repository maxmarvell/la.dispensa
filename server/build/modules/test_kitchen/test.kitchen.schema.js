"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.iterationSchema = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const createIterationCore = {
    recipeId: zod_1.z.string(),
    tag: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
};
const createIterationSchema = zod_1.z.object(createIterationCore);
const createIterationResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, createIterationCore), { ingredients: zod_1.z.array(zod_1.z.object({
        iterationId: zod_1.z.string(),
        ingredientId: zod_1.z.string(),
        quantity: zod_1.z.number(),
        unit: zod_1.z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
        ingredient: zod_1.z.object({
            name: zod_1.z.string(),
            id: zod_1.z.string(),
        })
    })), instructions: zod_1.z.array(zod_1.z.object({
        description: zod_1.z.string(),
        step: zod_1.z.number(),
        time: zod_1.z.object({
            hours: zod_1.z.number().optional(),
            minutes: zod_1.z.number().optional()
        }).optional(),
        temperature: zod_1.z.object({
            temperature: zod_1.z.number().optional(),
            unit: zod_1.z.enum(["C", "K"]).optional(),
        }).optional(),
        iterationId: zod_1.z.string()
    })), id: zod_1.z.string(), createdOn: zod_1.z.date(), updatedAt: zod_1.z.date() }));
const updateIterationSchema = zod_1.z.object({
    tag: zod_1.z.string().optional(),
});
const updateIterationIngredeientSchema = zod_1.z.object({
    unit: zod_1.z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
    quantity: zod_1.z.number().optional()
});
const createIterationIngredientSchema = zod_1.z.object({
    ingredient: zod_1.z.object({
        name: zod_1.z.string()
    }),
    unit: zod_1.z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
    quantity: zod_1.z.number(),
});
const createManyIterationIngredientsSchema = zod_1.z.array(createIterationIngredientSchema);
const createManyIterationIngredientsResponseSchema = zod_1.z.array(zod_1.z.object({
    ingredient: zod_1.z.object({
        name: zod_1.z.string(),
        id: zod_1.z.string()
    }),
    unit: zod_1.z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
    quantity: zod_1.z.number(),
    ingredientId: zod_1.z.string(),
    iterationId: zod_1.z.string(),
}));
const updateIterationInstructionSchema = zod_1.z.object({
    timeAndTemperature: zod_1.z.object({
        hours: zod_1.z.number().optional(),
        minutes: zod_1.z.number().optional(),
        temperature: zod_1.z.number(),
        unit: zod_1.z.enum(["C", "K"]),
    }).optional(),
    description: zod_1.z.string().optional(),
    step: zod_1.z.number(),
    iterationId: zod_1.z.string(),
});
const updateIterationInstructionResponseSchema = zod_1.z.object({
    timeAndTemperature: zod_1.z.object({
        hours: zod_1.z.number().optional(),
        minutes: zod_1.z.number().optional(),
        temperature: zod_1.z.number(),
        unit: zod_1.z.enum(["C", "K"]),
    }).optional(),
    description: zod_1.z.string(),
    step: zod_1.z.number(),
    iterationId: zod_1.z.string(),
});
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createIterationSchema,
    createIterationResponseSchema,
    updateIterationSchema,
    updateIterationIngredeientSchema,
    createIterationIngredientSchema,
    createManyIterationIngredientsSchema,
    createManyIterationIngredientsResponseSchema,
    updateIterationInstructionSchema,
    updateIterationInstructionResponseSchema
}, { $id: "IterationSchema" }), exports.iterationSchema = _a.schemas, exports.$ref = _a.$ref;
//# sourceMappingURL=test.kitchen.schema.js.map