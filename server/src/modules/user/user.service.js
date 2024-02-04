"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.findGalleryRecipes = exports.acceptConnection = exports.getConnectedBy = exports.getConnections = exports.deleteConnection = exports.createConnection = exports.getUser = exports.addUserPhoto = exports.findUsers = exports.findUserByEmail = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt = __importStar(require("bcrypt"));
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password } = input, rest = __rest(input, ["password"]);
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        const user = yield prisma_1.default.user.create({
            data: Object.assign(Object.assign({}, rest), { salt, password: hashedPassword }),
        });
        return user;
    });
}
exports.createUser = createUser;
;
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({
            where: {
                email,
            }
        });
    });
}
exports.findUserByEmail = findUserByEmail;
;
function findUsers(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(userId);
        return prisma_1.default.user.findMany({
            where: {
                NOT: {
                    id: userId
                }
            },
            select: {
                password: false,
                salt: false,
                email: false,
                image: true,
                id: true,
                username: true,
                connectedWith: true,
                connectedBy: true,
            }
        });
    });
}
exports.findUsers = findUsers;
;
function addUserPhoto(filepath, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.update({
            where: {
                id: userId
            },
            data: {
                image: filepath
            }
        });
    });
}
exports.addUserPhoto = addUserPhoto;
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({
            where: {
                id
            },
            select: {
                email: true,
                username: true,
                image: true,
            }
        });
    });
}
exports.getUser = getUser;
;
// Connections services
function createConnection(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.connection.create({
            data: input
        });
    });
}
exports.createConnection = createConnection;
;
function deleteConnection(connectedWithId, connectedById) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.connection.delete({
            where: {
                ConnectionId: {
                    connectedWithId,
                    connectedById
                }
            }
        });
    });
}
exports.deleteConnection = deleteConnection;
;
function getConnections(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.connection.findMany({
            where: {
                connectedById: userId,
                accepted: true
            },
            include: {
                connectedWith: {
                    select: {
                        username: true,
                        image: true,
                        id: true
                    }
                }
            }
        });
    });
}
exports.getConnections = getConnections;
function getConnectedBy({ userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.connection.findMany({
            where: {
                connectedWithId: userId,
                accepted: true,
            },
            include: {
                connectedBy: {
                    select: {
                        username: true,
                        image: true,
                        id: true
                    }
                }
            }
        });
    });
}
exports.getConnectedBy = getConnectedBy;
function acceptConnection({ connectedById, userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.connection.update({
            where: {
                ConnectionId: { connectedWithId: userId, connectedById }
            },
            data: {
                accepted: true
            }
        });
    });
}
exports.acceptConnection = acceptConnection;
// Profile services
function findGalleryRecipes({ userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        let rated = yield prisma_1.default.rating.groupBy({
            by: ['recipeId'],
            where: {
                recipe: {
                    authorId: userId
                }
            },
            _avg: { value: true },
            orderBy: {
                _avg: {
                    value: "desc"
                }
            },
            take: 10,
        });
        let recipes = yield prisma_1.default.recipe.findMany({
            where: {
                id: {
                    in: rated.map(({ recipeId }) => recipeId)
                }
            },
            include: {
                author: {
                    select: {
                        username: true,
                        id: true
                    }
                },
                editors: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                id: true
                            }
                        }
                    }
                }
            }
        });
        // Adding the average rating field to return typr of recipes
        return rated.map(({ _avg, recipeId }) => (Object.assign({ averageRating: _avg.value }, recipes.find(({ id }) => id === recipeId))));
    });
}
exports.findGalleryRecipes = findGalleryRecipes;
;
