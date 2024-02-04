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
exports.findGalleryRecipesHandler = exports.acceptConnectionHandler = exports.getConnectedByHandler = exports.getConnectionsHandler = exports.connectDeleteHandler = exports.connectHandler = exports.uploadPhotoHandler = exports.getUserHandler = exports.getUsersHandler = exports.loginHandler = exports.registerUserHandler = void 0;
const user_service_1 = require("./user.service");
const bcrypt = __importStar(require("bcrypt"));
const app_1 = require("../../app");
const user_service_2 = require("./user.service");
const aws_s3_1 = __importDefault(require("../../utils/aws.s3"));
function registerUserHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        try {
            const user = yield (0, user_service_1.createUser)(body);
            return reply.code(201).send(user);
        }
        catch (e) {
            console.log(e);
            return reply.code(500);
        }
    });
}
exports.registerUserHandler = registerUserHandler;
;
function loginHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        const user = yield (0, user_service_1.findUserByEmail)(body.email);
        if (!user) {
            return reply.code(401).send({
                message: "invalid email or password",
            });
        }
        const correctPassword = yield bcrypt.compare(body.password, user.password);
        if (correctPassword) {
            const { password, salt } = user, rest = __rest(user, ["password", "salt"]);
            return { accessToken: app_1.server.jwt.sign(rest) };
        }
        return reply.code(401).send({
            message: "invalid email or password",
        });
    });
}
exports.loginHandler = loginHandler;
;
function getUsersHandler(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = request.query;
        const users = yield (0, user_service_1.findUsers)(userId);
        return users;
    });
}
exports.getUsersHandler = getUsersHandler;
;
function getUserHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = request.params;
        const user = yield (0, user_service_1.getUser)(userId);
        if (!user) {
            return reply.code(404).send({
                message: "user not found"
            });
        }
        ;
        return user;
    });
}
exports.getUserHandler = getUserHandler;
;
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
                const { userId } = request.params;
                const filepath = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${data.filename}`;
                const user = yield (0, user_service_2.addUserPhoto)(filepath, userId);
                return user;
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
// Connection controllers
function connectHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        try {
            const connection = yield (0, user_service_1.createConnection)(body);
            return reply.code(201).send(connection);
        }
        catch (e) {
            console.log(e);
            return reply.code(400);
        }
        ;
    });
}
exports.connectHandler = connectHandler;
;
function connectDeleteHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { connectedWithId, connectedById } = request.params;
        console.log(connectedWithId, connectedById);
        try {
            const result = yield (0, user_service_1.deleteConnection)(connectedWithId, connectedById);
            return reply.code(200).send(result);
        }
        catch (e) {
            console.log(e);
            return reply.code(400);
        }
        ;
    });
}
exports.connectDeleteHandler = connectDeleteHandler;
;
function getConnectionsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = request.params;
            const users = yield (0, user_service_1.getConnections)(userId);
            console.log(users);
            return users;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.getConnectionsHandler = getConnectionsHandler;
function getConnectedByHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, user_service_1.getConnectedBy)(Object.assign({}, request.params));
            return data;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.getConnectedByHandler = getConnectedByHandler;
function acceptConnectionHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, connectedById } = request.params;
            const result = yield (0, user_service_1.acceptConnection)({ userId, connectedById });
            return result;
        }
        catch (error) {
            console.log(error);
            return reply.code(401);
        }
    });
}
exports.acceptConnectionHandler = acceptConnectionHandler;
function findGalleryRecipesHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recipes = yield (0, user_service_1.findGalleryRecipes)({ userId: request.params.userId });
            return recipes;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.findGalleryRecipesHandler = findGalleryRecipesHandler;
;
