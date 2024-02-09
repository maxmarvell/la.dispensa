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
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./user.controller");
const user_schema_1 = require("./user.schema");
function userRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post('/', {
            schema: {
                body: (0, user_schema_1.$ref)('createUserSchema'),
                response: {
                    201: (0, user_schema_1.$ref)('createUserResponseSchema')
                }
            }
        }, user_controller_1.registerUserHandler);
        server.post('/login', {
            schema: {
                body: (0, user_schema_1.$ref)('loginSchema'),
                response: {
                    200: (0, user_schema_1.$ref)('loginResponseSchema')
                }
            }
        }, user_controller_1.loginHandler);
        server.patch('/:userId/uploadPhoto/', {
            onRequest: [server.authenticate]
        }, user_controller_1.uploadPhotoHandler);
        server.get('/', user_controller_1.getUsersHandler);
        server.get('/:userId', user_controller_1.getUserHandler);
        // Connections routes
        server.get('/connections', user_controller_1.getConnectionsHandler);
        server.post('/:userId/connect/', {
            onRequest: [server.authenticate]
        }, user_controller_1.connectHandler);
        server.delete('/:userId/connect/', {
            onRequest: [server.authenticate]
        }, user_controller_1.removeConnectionHandler);
        server.put('/:userId/connect/', {
            onRequest: [server.authenticate]
        }, user_controller_1.acceptConnectionHandler);
        server.get('/connection-requests', {
            onRequest: [server.authenticate],
        }, user_controller_1.getConnectionRequestsHandler);
        // Gallery
        server.get('/:userId/gallery', user_controller_1.findGalleryRecipesHandler);
        // User setting services
        server.patch('/:userId/updatePassword/', {
            schema: {
                body: (0, user_schema_1.$ref)('changePasswordSchema')
            },
            // onRequest: [server.authenticate]
        }, user_controller_1.changeUserPasswordHandler);
    });
}
exports.default = userRoutes;
//# sourceMappingURL=user.route.js.map