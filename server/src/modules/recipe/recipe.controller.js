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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTagsHandler = exports.updateReviewHandler = exports.createReviewHandler = exports.getReviewHandler = exports.getReviewsHandler = exports.createRatingHandler = exports.updateRatingHandler = exports.getRatingHandler = exports.getRatingsHandler = exports.removeEditorHandler = exports.addEditorHandler = exports.getEditorsHandler = exports.uploadPhotoHandler = exports.getAvailableComponentsHandler = exports.removeConnectComponentHandler = exports.connectComponentHandler = exports.getComponentsHandler = exports.removeRecipeHandler = exports.updateRecipeHandler = exports.getRecipeHandler = exports.createRecipeHandler = exports.findTestKitchenRecipesHandler = exports.getRecipesHandler = void 0;
const recipe_service_1 = require("./recipe.service");
const aws_s3_1 = __importDefault(require("../../utils/aws.s3"));
const recipe_service_2 = require("./recipe.service");
function getRecipesHandler(request, reply) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title } = request.query;
            const page = Number(request.query.page);
            const take = Number(request.query.take);
            const tags = ((_a = request.query.tags) === null || _a === void 0 ? void 0 : _a.length) ? request.query.tags.split(',') : undefined;
            const recipes = yield (0, recipe_service_1.findRecipes)({ title, page, take, tags });
            return recipes;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.getRecipesHandler = getRecipesHandler;
;
function findTestKitchenRecipesHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recipes = yield (0, recipe_service_1.findTestKitchenRecipes)(Object.assign({ userId: request.user.id }, request.query));
            return recipes;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.findTestKitchenRecipesHandler = findTestKitchenRecipesHandler;
;
function createRecipeHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recipe = yield (0, recipe_service_1.createRecipe)(Object.assign(Object.assign({}, request.body), { authorId: request.user.id }));
            return recipe;
        }
        catch (e) {
            console.log(e);
            return reply.code(400);
        }
    });
}
exports.createRecipeHandler = createRecipeHandler;
function getRecipeHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { recipeId } = request.params;
        const recipe = yield (0, recipe_service_1.findUniqueRecipe)(recipeId);
        if (!recipe) {
            return reply.code(404).send({
                message: "Recipe not found!"
            });
        }
        return recipe;
    });
}
exports.getRecipeHandler = getRecipeHandler;
function updateRecipeHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recipe = yield (0, recipe_service_1.updateRecipe)(Object.assign(Object.assign({}, request.body), { recipeId: request.params.recipeId }));
            return recipe;
        }
        catch (e) {
            console.log(e);
            return reply.code(400);
        }
    });
}
exports.updateRecipeHandler = updateRecipeHandler;
function removeRecipeHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, recipe_service_1.removeRecipe)(Object.assign({}, request.params));
            return result;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.removeRecipeHandler = removeRecipeHandler;
function getComponentsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const components = yield (0, recipe_service_1.getComponents)(request.params.recipeId);
            return components;
        }
        catch (error) {
            console.log(error);
            reply.code(404);
        }
    });
}
exports.getComponentsHandler = getComponentsHandler;
function connectComponentHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { recipeId } = request.params;
            const component = yield (0, recipe_service_1.connectComponent)(Object.assign(Object.assign({}, request.body), { recipeId }));
            return component;
        }
        catch (error) {
            console.log(error);
            reply.code(401);
        }
    });
}
exports.connectComponentHandler = connectComponentHandler;
function removeConnectComponentHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { recipeId, componentId } = request.params;
            const result = yield (0, recipe_service_1.removeConnectComponent)(recipeId, componentId);
            return result;
        }
        catch (error) {
            console.log(error);
            reply.code(401);
        }
    });
}
exports.removeConnectComponentHandler = removeConnectComponentHandler;
function getAvailableComponentsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recipes = yield (0, recipe_service_1.availableToConnect)(Object.assign(Object.assign({}, request.query), request.params));
            return recipes;
        }
        catch (error) {
            console.error(error);
            reply.code(404);
        }
    });
}
exports.getAvailableComponentsHandler = getAvailableComponentsHandler;
function uploadPhotoHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield request.file();
            if (!data) {
                throw new Error('No file provided');
            }
            ;
            const upload = yield (0, aws_s3_1.default)(data);
            if (upload.ok) {
                const { recipeId } = request.params;
                const filepath = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${data.filename}`;
                const recipe = yield (0, recipe_service_2.addRecipePhoto)(filepath, recipeId);
                return recipe;
            }
            ;
            return { ok: false };
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
        ;
    });
}
exports.uploadPhotoHandler = uploadPhotoHandler;
;
function getEditorsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, recipe_service_1.getEditor)(request.params);
            return data;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.getEditorsHandler = getEditorsHandler;
function addEditorHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, recipe_service_1.addEditor)(Object.assign(Object.assign({}, request.params), request.body));
            return data;
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
    });
}
exports.addEditorHandler = addEditorHandler;
function removeEditorHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, recipe_service_1.removeEditor)(request.params);
            return { ok: true };
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.removeEditorHandler = removeEditorHandler;
function getRatingsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ratings = yield (0, recipe_service_1.getRatings)(request.params);
            return ratings;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.getRatingsHandler = getRatingsHandler;
;
function getRatingHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rating = yield (0, recipe_service_1.getRating)(request.params);
            return rating;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.getRatingHandler = getRatingHandler;
;
function updateRatingHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rating = yield (0, recipe_service_1.updateRating)(Object.assign(Object.assign({}, request.params), request.body));
            return rating;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.updateRatingHandler = updateRatingHandler;
function createRatingHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rating = yield (0, recipe_service_1.createRating)(Object.assign(Object.assign({}, request.body), request.params));
            return rating;
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
        ;
    });
}
exports.createRatingHandler = createRatingHandler;
;
function getReviewsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reviews = yield (0, recipe_service_1.getReviews)(request.params);
            return reviews;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.getReviewsHandler = getReviewsHandler;
;
function getReviewHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const review = yield (0, recipe_service_1.getReview)(request.params);
            return review;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.getReviewHandler = getReviewHandler;
function createReviewHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const review = yield (0, recipe_service_1.createReview)(Object.assign(Object.assign({}, request.params), request.body));
            return review;
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
        ;
    });
}
exports.createReviewHandler = createReviewHandler;
;
function updateReviewHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const review = yield (0, recipe_service_1.updateReview)(Object.assign(Object.assign({}, request.body), request.params));
            return review;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.updateReviewHandler = updateReviewHandler;
// Tags
function updateTagsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tags = yield (0, recipe_service_1.updateTags)(Object.assign({ tags: request.body }, request.params));
            console.log(tags);
            return tags;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.updateTagsHandler = updateTagsHandler;
