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
exports.getRecipeNotifications = exports.getDashboardUsers = exports.getDashboard = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
;
function getDashboard(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let { lastCursor, take } = input;
        const results = yield prisma_1.default.recipe.findMany(Object.assign(Object.assign({ take: parseInt(take) }, (lastCursor && {
            skip: 1,
            cursor: {
                id: lastCursor,
            }
        })), { orderBy: {
                createdOn: "desc",
            }, include: {
                author: true,
                tags: true
            } }));
        if (results.length == 0) {
            return {
                recipes: [],
                lastCursor: null,
                hasNextPage: false,
            };
        }
        let ratings = yield prisma_1.default.rating.groupBy({
            by: ['recipeId'],
            where: {
                recipeId: {
                    in: results.map(({ id }) => id)
                }
            },
            _avg: { value: true },
            _count: true
        });
        let reviews = yield prisma_1.default.review.groupBy({
            by: ['recipeId'],
            where: {
                recipeId: {
                    in: results.map(({ id }) => id)
                }
            },
            _count: true
        });
        const lastPostInResults = results[results.length - 1];
        const cursor = lastPostInResults.id;
        const nextPage = yield prisma_1.default.recipe.findMany({
            take: parseInt(take),
            skip: 1,
            cursor: {
                id: cursor,
            },
            orderBy: {
                createdOn: "desc",
            }
        });
        return {
            recipes: results.map(el => {
                let { id } = el;
                let rating = ratings.find(({ recipeId }) => (recipeId === id));
                let review = reviews.find(({ recipeId }) => (recipeId === id));
                return Object.assign(Object.assign({}, el), { rating, review });
            }),
            lastCursor: cursor,
            hasNextPage: nextPage.length > 0,
        };
    });
}
exports.getDashboard = getDashboard;
;
;
function getDashboardUsers(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let { take, userId, username } = input;
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        // console.log(user)
        const connections = yield prisma_1.default.user.findMany({
            where: Object.assign(Object.assign({}, (username && {
                username: {
                    contains: username,
                    mode: 'insensitive'
                }
            })), { id: {
                    not: userId
                }, OR: [
                    {
                        connectedBy: {
                            some: {
                                connectedById: userId
                            }
                        }
                    },
                    {
                        connectedWith: {
                            some: {
                                connectedWithId: userId
                            }
                        }
                    },
                ] }),
            take: parseInt(take),
            select: {
                username: true,
                image: true,
                id: true,
                connectedBy: true,
                connectedWith: true,
            }
        });
        if (connections.length === parseInt(take)) {
            return connections;
        }
        const otherUsers = yield prisma_1.default.user.findMany({
            where: Object.assign(Object.assign({}, (username && {
                username: {
                    contains: username,
                    mode: 'insensitive'
                }
            })), { AND: [
                    {
                        id: {
                            not: userId
                        }
                    },
                    {
                        id: {
                            notIn: connections.map(({ id }) => id)
                        }
                    }
                ] }),
            take: parseInt(take) - connections.length,
            select: {
                username: true,
                image: true,
                id: true,
                connectedBy: true,
                connectedWith: true,
            }
        });
        return [...connections, ...otherUsers];
    });
}
exports.getDashboardUsers = getDashboardUsers;
;
function getRecipeNotifications(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = input;
        const connections = yield prisma_1.default.user.findMany({
            where: {
                OR: [
                    {
                        connectedBy: {
                            some: {
                                connectedById: userId
                            }
                        }
                    },
                    {
                        connectedWith: {
                            some: {
                                connectedWithId: userId
                            }
                        }
                    }
                ]
            },
            select: {
                id: true
            }
        });
        return prisma_1.default.recipe.findMany({
            where: {
                authorId: {
                    in: connections.map(({ id }) => id)
                }
            },
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        username: true,
                        image: true,
                    }
                }
            }
        });
    });
}
exports.getRecipeNotifications = getRecipeNotifications;
//# sourceMappingURL=dashboard.service.js.map