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
exports.deleteInstruction = exports.updateInstruction = exports.createInstruction = exports.getInstructions = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
function getInstructions(recipeId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.instruction.findMany({
            where: {
                recipeId
            },
            orderBy: {
                step: 'asc'
            },
            include: {
                timeAndTemperature: true
            }
        });
    });
}
exports.getInstructions = getInstructions;
function createInstruction(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { timeAndTemperature } = input, data = __rest(input, ["timeAndTemperature"]);
        if (timeAndTemperature) {
            return prisma_1.default.instruction.create({
                data: Object.assign(Object.assign({}, data), { timeAndTemperature: {
                        create: Object.assign({}, timeAndTemperature)
                    } })
            });
        }
        else {
            return prisma_1.default.instruction.create({
                data: data
            });
        }
        ;
    });
}
exports.createInstruction = createInstruction;
function updateInstruction(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { recipeId, step } = input, rest = __rest(input, ["recipeId", "step"]);
        const { timeAndTemperature } = rest, data = __rest(rest, ["timeAndTemperature"]);
        if (timeAndTemperature) {
            data.temperature = {
                upsert: {
                    create: Object.assign({}, timeAndTemperature),
                    update: Object.assign({}, timeAndTemperature),
                }
            };
        }
        return prisma_1.default.instruction.update({
            where: {
                InstructionId: {
                    recipeId, step: Number(step)
                }
            },
            data: data
        });
    });
}
exports.updateInstruction = updateInstruction;
;
function deleteInstruction({ step, recipeId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const instructionsToUpdate = yield prisma_1.default.instruction.findMany({
            select: {
                step: true,
                recipeId: true,
            },
            where: {
                recipeId,
                step: {
                    gt: Number(step)
                }
            }
        });
        yield prisma_1.default.instruction.delete({
            where: {
                InstructionId: {
                    step: Number(step), recipeId
                }
            }
        });
        yield Promise.all(instructionsToUpdate.map((instruction) => {
            console.log(instruction);
            return new Promise(resolve => resolve(prisma_1.default.instruction.update({
                where: {
                    InstructionId: {
                        step: instruction.step,
                        recipeId: instruction.recipeId
                    }
                },
                data: {
                    step: {
                        decrement: 1
                    }
                }
            })));
        }));
        return { ok: true };
    });
}
exports.deleteInstruction = deleteInstruction;
;
