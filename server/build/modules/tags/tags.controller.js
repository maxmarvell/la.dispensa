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
exports.searchTagsHandler = void 0;
const tags_service_1 = require("./tags.service");
function searchTagsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { excludeTags, name } = request.query;
            let exlude = excludeTags.split(',');
            console.log(request.query);
            const tags = (0, tags_service_1.searchTags)({
                name, excludeTags: exlude
            });
            return tags;
        }
        catch (error) {
            console.log(error);
            return reply.code(404);
        }
    });
}
exports.searchTagsHandler = searchTagsHandler;
//# sourceMappingURL=tags.controller.js.map