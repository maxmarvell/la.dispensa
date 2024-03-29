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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const Modules = __importStar(require("./modules/index"));
exports.server = (0, fastify_1.default)();
exports.server.register(require('@fastify/jwt'), {
    secret: "bigsecretbigsecretbigsecretbigsecret"
});
exports.server.register(require('@fastify/cors'), {
    origin: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
});
exports.server.register(require('@fastify/multipart'), {
    addToBody: true,
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
}).after(() => { });
exports.server.decorate("authenticate", function (request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield request.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
});
exports.server.get('/healthcheck', function () {
    return __awaiter(this, void 0, void 0, function* () {
        return { status: 'ok' };
    });
});
exports.server.addHook("preHandler", (req, reply, next) => {
    req.jwt = exports.server.jwt;
    return next();
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const schemas = [...Modules.userSchemas, ...Modules.recipeSchemas, ...Modules.instructionSchemas, ...Modules.ingredientSchemas, ...Modules.iterationSchema];
        for (const schema of schemas) {
            exports.server.addSchema(schema);
        }
        ;
        exports.server.register(Modules.userRoutes, { prefix: "api/users" });
        exports.server.register(Modules.recipeRoutes, { prefix: "api/recipes" });
        exports.server.register(Modules.instructionRoutes, { prefix: "api/instructions" });
        exports.server.register(Modules.ingredientRoutes, { prefix: "api/ingredients" });
        exports.server.register(Modules.iterationRoutes, { prefix: "api/iterations" });
        exports.server.register(Modules.tagRoutes, { prefix: "api/tags" });
        exports.server.register(Modules.dashboardRoutes, { prefix: "api/dashboard" });
        const port = Number(process.env.PORT) || 3000;
        const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;
        exports.server.listen({ port: port, host: host }, function (err, address) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`server listening on ${address}`);
        });
    });
}
main();
//# sourceMappingURL=app.js.map