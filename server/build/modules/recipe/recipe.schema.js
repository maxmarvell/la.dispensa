"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.recipeSchemas = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const recipeCore = {
    title: zod_1.z.string({
        required_error: "A recipe requires a title"
    }),
};
const createRecipeSchema = zod_1.z.object(Object.assign({}, recipeCore));
const createRecipeResponseSchema = zod_1.z.object(Object.assign({ id: zod_1.z.string(), authorId: zod_1.z.string({
        required_error: "A recipe must have an author"
    }) }, recipeCore));
const updateRecipeCore = {
    title: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    description: zod_1.z.string().optional()
};
const updateRecipeSchema = zod_1.z.object(Object.assign({}, updateRecipeCore));
const updateRecipeResponseSchema = Object.assign(Object.assign({}, updateRecipeCore), { authorId: zod_1.z.string({
        required_error: "A recipe must have an author"
    }) });
const componentCore = {
    componentId: zod_1.z.string(),
    amount: zod_1.z.number()
};
const connectComponentSchema = zod_1.z.object(Object.assign({}, componentCore));
const connectComponentResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, componentCore), { RecipeComponentId: zod_1.z.string() }));
const addEditorSchema = zod_1.z.object({
    userId: zod_1.z.string()
});
// Ratings
const createRatingSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    value: zod_1.z.number(),
});
const updateRatingSchema = zod_1.z.object({
    value: zod_1.z.number(),
});
// Reviews
const createReviewSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    text: zod_1.z.string(),
});
const updateReviewSchema = zod_1.z.object({
    text: zod_1.z.string()
});
// Tags
const updateTagsSchema = zod_1.z.array(zod_1.z.object({
    name: zod_1.z.string()
})).max(3);
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createRecipeSchema,
    createRecipeResponseSchema,
    updateRecipeSchema,
    connectComponentSchema,
    connectComponentResponseSchema,
    addEditorSchema,
    createRatingSchema,
    createReviewSchema,
    updateRatingSchema,
    updateReviewSchema,
    updateTagsSchema,
}, { $id: "RecipeSchema" }), exports.recipeSchemas = _a.schemas, exports.$ref = _a.$ref;
//# sourceMappingURL=recipe.schema.js.map