"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.ingredientSchemas = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const ingredientCore = {
    recipeId: zod_1.z.string(),
    ingredient: zod_1.z.object({
        name: zod_1.z.string()
    }),
    unit: zod_1.z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
    quantity: zod_1.z.number()
};
const createIngredientSchema = zod_1.z.object(ingredientCore);
const createManyIngredientSchema = zod_1.z.array(createIngredientSchema);
const createManyIngredientResponseSchema = zod_1.z.array(zod_1.z.object(Object.assign(Object.assign({}, ingredientCore), { id: zod_1.z.string() })));
const updateIngredientCore = {
    ingredient: zod_1.z.object({
        name: zod_1.z.string()
    }),
    unit: zod_1.z.enum(["G", "KG", "CUP", "ML", "L", "OZ"]).optional(),
    quantity: zod_1.z.number(),
};
const updateIngredientSchema = zod_1.z.object(Object.assign({}, updateIngredientCore));
const updateIngredientResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, updateIngredientCore), { ingreidentId: zod_1.z.string(), recipeId: zod_1.z.string() }));
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createIngredientSchema,
    createManyIngredientSchema,
    createManyIngredientResponseSchema,
    updateIngredientSchema,
    updateIngredientResponseSchema
}, { $id: "IngredientSchema" }), exports.ingredientSchemas = _a.schemas, exports.$ref = _a.$ref;
//# sourceMappingURL=ingredient.schema.js.map