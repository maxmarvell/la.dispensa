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
exports.getRecipeNotificationsHandler = exports.getDashboardUsersHandler = exports.getDashboardHandler = void 0;
const dashboard_service_1 = require("./dashboard.service");
function getDashboardHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        let { lastCursor, take } = request.query;
        // let { id: userId } = request.user;
        try {
            let data = yield (0, dashboard_service_1.getDashboard)({ lastCursor, take });
            return reply.code(200).send(data);
        }
        catch (error) {
            console.log(error);
            return reply.code(404).send(error);
        }
        ;
    });
}
exports.getDashboardHandler = getDashboardHandler;
;
function getDashboardUsersHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        let { take, username } = request.query;
        let { id: userId } = request.user;
        try {
            let data = yield (0, dashboard_service_1.getDashboardUsers)({ take, username, userId });
            return reply.code(200).send(data);
        }
        catch (error) {
            console.log(error);
            return reply.code(404).send(error);
        }
        ;
    });
}
exports.getDashboardUsersHandler = getDashboardUsersHandler;
;
function getRecipeNotificationsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        let { id: userId } = request.user;
        try {
            let data = yield (0, dashboard_service_1.getRecipeNotifications)({ userId });
            return reply.code(200).send(data);
        }
        catch (error) {
            console.log(error);
            return reply.code(404).send(error);
        }
        ;
    });
}
exports.getRecipeNotificationsHandler = getRecipeNotificationsHandler;
;
//# sourceMappingURL=dashboard.controller.js.map