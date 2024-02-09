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
exports.updateIterationInstruction = exports.createIterationingredient = exports.updateIterationIngredient = exports.deleteIterationIngredient = exports.updateIteration = exports.createIteration = exports.getIterationInstance = exports.getIterations = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
function getIterations(recipeId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.iteration.findMany({
            where: {
                recipeId
            },
            include: {
                parent: {
                    include: {
                        ingredients: {
                            include: {
                                ingredient: true
                            }
                        },
                        instructions: true
                    }
                },
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                instructions: {
                    include: {
                        timeAndTemperature: true,
                    }
                },
            }
        });
    });
}
exports.getIterations = getIterations;
;
function getIterationInstance(iterationId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.iteration.findUnique({
            where: {
                id: iterationId
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                instructions: true,
            }
        });
    });
}
exports.getIterationInstance = getIterationInstance;
;
function createIteration(input) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract the recipeId and rest
        const { recipeId } = input, rest = __rest(input, ["recipeId"]);
        // ...rest still contains parentId field
        const { parentId } = rest;
        // Parent ingredients are either the original recipe or the parent iteration
        const ingredients = parentId ? (yield prisma_1.default.ingredientIteration.findMany({
            where: {
                iterationId: parentId,
            },
            select: {
                unit: true,
                quantity: true,
                ingredientId: true
            }
        })) : (yield prisma_1.default.recipeIngredient.findMany({
            where: {
                recipeId
            },
            select: {
                unit: true,
                quantity: true,
                ingredientId: true
            }
        }));
        if (parentId) {
            let parentInstructions = yield prisma_1.default.instructionIteration.findMany({
                where: {
                    iterationId: parentId,
                },
                include: {
                    timeAndTemperature: {
                        select: {
                            hours: true,
                            temperature: true,
                            minutes: true,
                            unit: true
                        }
                    }
                }
            });
            // Map the instructions to a nested create query
            const instructions = parentInstructions.map((_a) => {
                var { timeAndTemperature } = _a, rest = __rest(_a, ["timeAndTemperature"]);
                return Object.assign(Object.assign({}, rest), (timeAndTemperature && {
                    timeAndTemperature: {
                        create: timeAndTemperature
                    }
                }));
            });
            // Nested creation of the iteration and the ingredient fields
            const iteration = yield prisma_1.default.iteration.create({
                data: Object.assign(Object.assign({}, rest), { recipeId, ingredients: {
                        createMany: {
                            data: ingredients
                        }
                    } }),
                include: {
                    ingredients: true
                }
            });
            // Connnect the instructions with a nested create
            yield Promise.all(instructions.map((_a) => {
                var { iterationId } = _a, rest = __rest(_a, ["iterationId"]);
                return new Promise(resolve => resolve(prisma_1.default.instructionIteration.create({
                    data: Object.assign({ iterationId: iteration.id }, rest)
                })));
            }));
            return prisma_1.default.iteration.findUnique({
                where: {
                    id: iteration.id
                },
                include: {
                    parent: {
                        include: {
                            ingredients: {
                                include: {
                                    ingredient: true
                                }
                            },
                            instructions: true
                        }
                    },
                    ingredients: {
                        include: {
                            ingredient: true
                        }
                    },
                    instructions: {
                        include: {
                            timeAndTemperature: true,
                        }
                    },
                }
            });
        }
        ;
        // Parent instructions are either the OG recipe or the parent iteration
        // Only take fields with temperature and time fields
        let parentInstructions = yield prisma_1.default.instruction.findMany({
            where: {
                recipeId,
            },
            include: {
                timeAndTemperature: {
                    select: {
                        hours: true,
                        temperature: true,
                        minutes: true,
                        unit: true
                    }
                }
            }
        });
        // Map the instructions to a nested create query
        const instructions = parentInstructions.map((_a) => {
            var { timeAndTemperature } = _a, rest = __rest(_a, ["timeAndTemperature"]);
            return (Object.assign(Object.assign({}, rest), (timeAndTemperature && {
                timeAndTemperature: {
                    create: timeAndTemperature
                }
            })));
        });
        // Nested creation of the iteration and the ingredient fields
        const iteration = yield prisma_1.default.iteration.create({
            data: Object.assign(Object.assign({}, rest), { recipeId, ingredients: {
                    createMany: {
                        data: ingredients
                    }
                } }),
            include: {
                ingredients: true
            }
        });
        // Connnect the instructions with a nested create
        yield Promise.all(instructions.map((_a) => {
            var { recipeId } = _a, rest = __rest(_a, ["recipeId"]);
            return new Promise(resolve => resolve(prisma_1.default.instructionIteration.create({
                data: Object.assign({ iterationId: iteration.id }, rest)
            })));
        }));
        return prisma_1.default.iteration.findUnique({
            where: {
                id: iteration.id
            },
            include: {
                parent: {
                    include: {
                        ingredients: {
                            include: {
                                ingredient: true
                            }
                        },
                        instructions: true
                    }
                },
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                instructions: {
                    include: {
                        timeAndTemperature: true,
                    }
                },
            }
        });
    });
}
exports.createIteration = createIteration;
;
function updateIteration(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { iterationId } = input, rest = __rest(input, ["iterationId"]);
        return prisma_1.default.iteration.update({
            where: {
                id: iterationId
            },
            data: rest
        });
    });
}
exports.updateIteration = updateIteration;
;
;
function deleteIterationIngredient(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.ingredientIteration.delete({
            where: {
                RecipeIngredientId: Object.assign({}, input)
            }
        });
    });
}
exports.deleteIterationIngredient = deleteIterationIngredient;
;
function updateIterationIngredient(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ingredientId, iterationId } = input, rest = __rest(input, ["ingredientId", "iterationId"]);
        console.log(ingredientId, iterationId);
        return prisma_1.default.ingredientIteration.update({
            where: {
                RecipeIngredientId: {
                    iterationId,
                    ingredientId,
                }
            },
            data: Object.assign({}, rest)
        });
    });
}
exports.updateIterationIngredient = updateIterationIngredient;
;
function createIterationingredient(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ingredient } = input, data = __rest(input, ["ingredient"]);
        const fetchIngredient = yield prisma_1.default.ingredient.upsert({
            where: {
                name: ingredient.name
            },
            update: {},
            create: {
                name: ingredient.name
            },
            select: {
                id: true
            }
        });
        return prisma_1.default.ingredientIteration.create({
            data: Object.assign(Object.assign({}, data), { ingredientId: fetchIngredient.id }),
            include: {
                ingredient: true
            }
        });
    });
}
exports.createIterationingredient = createIterationingredient;
;
;
function updateIterationInstruction(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { step, iterationId } = input, data = __rest(input, ["step", "iterationId"]);
        const { timeAndTemperature } = data, rest = __rest(data, ["timeAndTemperature"]);
        return prisma_1.default.instructionIteration.update({
            where: {
                InstructionId: {
                    step: Number(step),
                    iterationId
                }
            },
            data: Object.assign(Object.assign({}, rest), (timeAndTemperature && {
                timeAndTemperature: {
                    upsert: {
                        update: timeAndTemperature,
                        create: timeAndTemperature
                    }
                }
            })),
            include: {
                timeAndTemperature: true,
            }
        });
    });
}
exports.updateIterationInstruction = updateIterationInstruction;
;
//# sourceMappingURL=test.kitchen.service.js.map