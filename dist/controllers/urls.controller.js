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
const urls_service_1 = __importDefault(require("../services/urls.service"));
function createUrlMonitor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let url = req.body;
            if (!url.url || !url.user_id) {
                throw new Error("Url and user Id must be provided!");
            }
            url = yield urls_service_1.default.createUrlMonitor(url);
            res.send(url);
            logger.info(`POST /urls - ${JSON.stringify(url)}`);
        }
        catch (err) {
            next(err);
        }
    });
}
exports.default = {
    createUrlMonitor,
};
