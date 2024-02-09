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
exports.findGalleryRecipesHandler = exports.getConnectionRequestsHandler = exports.acceptConnectionHandler = exports.getConnectionsHandler = exports.removeConnectionHandler = exports.connectHandler = exports.uploadPhotoHandler = exports.getUserHandler = exports.getUsersHandler = exports.changeUserPasswordHandler = exports.loginHandler = exports.registerUserHandler = void 0;
const user_service_1 = require("./user.service");
const user_service_2 = require("./user.service");
const aws_s3_1 = __importDefault(require("../../utils/aws.s3"));
const hash_1 = require("../../utils/hash");
function registerUserHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        console.log(body);
        try {
            const user = yield (0, user_service_1.createUser)(body);
            return reply.code(201).send(user);
        }
        catch (e) {
            console.log(e);
            return reply.code(500).send(e);
        }
    });
}
exports.registerUserHandler = registerUserHandler;
function loginHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        // find a user by email
        const user = yield (0, user_service_1.findUserByEmail)(body.email);
        if (!user) {
            return reply.code(401).send({
                message: "Invalid email or password",
            });
        }
        // verify password
        const correctPassword = (0, hash_1.verifyPassword)({
            candidatePassword: body.password,
            salt: user.salt,
            hash: user.password,
        });
        if (correctPassword) {
            const { password, salt } = user, rest = __rest(user, ["password", "salt"]);
            // generate access token
            return { accessToken: request.jwt.sign(rest) };
        }
        return reply.code(401).send({
            message: "Invalid username or password",
        });
    });
}
exports.loginHandler = loginHandler;
;
function changeUserPasswordHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password } = request.body;
        const { userId: id } = request.params;
        try {
            yield (0, user_service_1.changeUserPassword)({
                id, password
            });
            return reply.code(204).send();
        }
        catch (error) {
            console.log(error);
            return reply.code(404).send({
                message: "Unable to Change Password"
            });
        }
        ;
    });
}
exports.changeUserPasswordHandler = changeUserPasswordHandler;
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
        const { userId: connectedWithId } = request.params;
        const { id: connectedById } = request.user;
        try {
            const connection = yield (0, user_service_1.createConnection)({ connectedById, connectedWithId });
            return reply.code(201).send(connection);
        }
        catch (e) {
            console.log(e);
            return reply.code(400).send(e);
        }
        ;
    });
}
exports.connectHandler = connectHandler;
;
function removeConnectionHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId: connectedWithId } = request.params;
        const { id: connectedById } = request.user;
        try {
            const result = yield (0, user_service_1.removeConnection)({ connectedWithId, connectedById });
            return reply.code(200).send(result);
        }
        catch (e) {
            console.log(e);
            return reply.code(400);
        }
        ;
    });
}
exports.removeConnectionHandler = removeConnectionHandler;
;
function getConnectionsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = request.params;
            const users = yield (0, user_service_1.getConnections)(userId);
            return users;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
        ;
    });
}
exports.getConnectionsHandler = getConnectionsHandler;
;
function acceptConnectionHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId: connectedById } = request.params;
        const { id: connectedWithId } = request.user;
        try {
            yield (0, user_service_1.acceptConnection)({ connectedById, connectedWithId });
            return reply.code(204).send();
        }
        catch (error) {
            console.log(error);
            return reply.code(404).send(error);
        }
        ;
    });
}
exports.acceptConnectionHandler = acceptConnectionHandler;
;
function getConnectionRequestsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: userId } = request.user;
        try {
            let requests = yield (0, user_service_1.getConnectionRequests)(userId);
            return requests;
        }
        catch (error) {
            console.log(error);
            return reply.code(404).send(error);
        }
        ;
    });
}
exports.getConnectionRequestsHandler = getConnectionRequestsHandler;
;
// Profile controls
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
//# sourceMappingURL=user.controller.js.map