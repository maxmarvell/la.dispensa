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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTags = exports.updateReview = exports.getReview = exports.createReview = exports.getReviews = exports.createRating = exports.updateRating = exports.getRating = exports.getRatings = exports.removeEditor = exports.addEditor = exports.getEditor = exports.addRecipePhoto = exports.availableToConnect = exports.removeConnectComponent = exports.connectComponent = exports.getComponents = exports.removeRecipe = exports.updateRecipe = exports.findUniqueRecipe = exports.findTestKitchenRecipes = exports.findRecipes = exports.createRecipe = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
function createRecipe(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.recipe.create({
            data: input
        });
    });
}
exports.createRecipe = createRecipe;
// find recipes
function findRecipes(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, page, take, tags } = input;
        let skip = (page && take) ? (page - 1) * take : undefined;
        const tagQuery = input.tags ? {
            some: {
                name: {
                    in: tags
                }
            }
        } : undefined;
        return prisma_1.default.recipe.findMany({
            skip,
            take,
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
                tags: tagQuery
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        image: true
                    }
                }
            }
        });
    });
}
exports.findRecipes = findRecipes;
function findTestKitchenRecipes({ userId, title }) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.recipe.findMany({
            where: {
                OR: [
                    {
                        authorId: userId
                    },
                    {
                        editors: {
                            some: {
                                userId
                            }
                        }
                    }
                ],
                title: {
                    contains: title,
                    mode: 'insensitive',
                }
            },
            take: 5
        });
    });
}
exports.findTestKitchenRecipes = findTestKitchenRecipes;
;
function findUniqueRecipe(RecipeId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.recipe.findUnique({
            where: {
                id: RecipeId
            },
            include: {
                tags: true,
                author: true,
                ingredients: {
                    include: {
                        ingredient: {
                            select: {
                                name: true
                            },
                        },
                    },
                },
                instructions: {
                    include: {
                        timeAndTemperature: true
                    }
                },
                components: {
                    include: {
                        component: {
                            include: {
                                ingredients: {
                                    include: {
                                        ingredient: {
                                            select: {
                                                name: true
                                            },
                                        },
                                    },
                                },
                                instructions: {
                                    include: {
                                        timeAndTemperature: true
                                    }
                                },
                            }
                        }
                    }
                },
            }
        });
    });
}
exports.findUniqueRecipe = findUniqueRecipe;
function updateRecipe(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { recipeId } = input, rest = __rest(input, ["recipeId"]);
        return prisma_1.default.recipe.update({
            where: {
                id: recipeId
            },
            data: Object.assign({}, rest)
        });
    });
}
exports.updateRecipe = updateRecipe;
function removeRecipe({ recipeId }) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.recipe.delete({
            where: {
                id: recipeId
            }
        });
    });
}
exports.removeRecipe = removeRecipe;
function getComponents(recipeId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.component.findMany({
            where: {
                recipeId
            },
            include: {
                component: {
                    include: {
                        ingredients: {
                            include: {
                                ingredient: true
                            }
                        },
                        instructions: {
                            orderBy: {
                                step: 'asc'
                            }
                        },
                    }
                }
            }
        });
    });
}
exports.getComponents = getComponents;
function connectComponent(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.component.create({
            data: input
        });
    });
}
exports.connectComponent = connectComponent;
function removeConnectComponent(recipeId, componentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.component.delete({
            where: {
                RecipeComponentId: { recipeId, componentId }
            }
        });
    });
}
exports.removeConnectComponent = removeConnectComponent;
function availableToConnect(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorId, recipeId, title, page, take } = input;
        let skip = (page && take) ? (page - 1) * take : undefined;
        return prisma_1.default.recipe.findMany({
            skip: Number(skip),
            take: Number(take),
            where: {
                authorId,
                AND: [
                    {
                        NOT: {
                            parentRecipes: {
                                some: {
                                    recipeId
                                }
                            }
                        }
                    },
                    {
                        NOT: {
                            id: recipeId
                        }
                    }
                ],
                title: {
                    contains: title
                }
            },
            include: {
                author: true
            }
        });
    });
}
exports.availableToConnect = availableToConnect;
function addRecipePhoto(filepath, recipeId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.recipe.update({
            where: {
                id: recipeId
            },
            data: {
                image: filepath
            }
        });
    });
}
exports.addRecipePhoto = addRecipePhoto;
;
function getEditor({ recipeId }) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.recipeEditors.findMany({
            where: {
                recipeId
            }
        });
    });
}
exports.getEditor = getEditor;
;
function addEditor(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.recipeEditors.create({
            data: Object.assign({}, input)
        });
    });
}
exports.addEditor = addEditor;
;
function removeEditor(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.recipeEditors.delete({
            where: {
                EditorId: Object.assign({}, input)
            }
        });
    });
}
exports.removeEditor = removeEditor;
// Ratings
function getRatings({ recipeId }) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.rating.aggregate({
            where: {
                recipeId
            },
            _avg: {
                value: true
            },
            _count: true
        });
    });
}
exports.getRatings = getRatings;
;
function getRating(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.rating.findUnique({
            where: {
                RatingId: input
            }
        });
    });
}
exports.getRating = getRating;
;
function updateRating(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { value } = input, keys = __rest(input, ["value"]);
        return prisma_1.default.rating.update({
            where: {
                RatingId: keys
            },
            data: {
                value
            }
        });
    });
}
exports.updateRating = updateRating;
;
function createRating(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.rating.create({
            data: input
        });
    });
}
exports.createRating = createRating;
;
// Reviews
function getReviews({ recipeId }) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.review.findMany({
            where: {
                recipeId
            }
        });
    });
}
exports.getReviews = getReviews;
;
function createReview(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.review.create({
            data: input
        });
    });
}
exports.createReview = createReview;
;
function getReview(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.review.findUnique({
            where: {
                ReviewId: input
            }
        });
    });
}
exports.getReview = getReview;
;
function updateReview(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text } = input, keys = __rest(input, ["text"]);
        return prisma_1.default.review.update({
            where: {
                ReviewId: keys
            },
            data: {
                text
            }
        });
    });
}
exports.updateReview = updateReview;
;
// Tags
function updateTags(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { recipeId, tags } = input;
        const data = tags.map(({ name }) => ({ name, recipeId }));
        yield prisma_1.default.tag.deleteMany({
            where: {
                recipeId
            }
        });
        return prisma_1.default.tag.createMany({
            data: data
        });
    });
}
exports.updateTags = updateTags;
;
