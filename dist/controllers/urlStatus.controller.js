"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const urlStatus_service_1 = __importDefault(require("../services/urlStatus.service"));
async function getUrlMonitorsByUser(req, res, next) {
    try {
        res.send(await urlStatus_service_1.default.getUrlMonitorsByUser(parseInt(req.params.id)));
        logger.info(`GET /urls - User Id ${req.params.id}`);
    }
    catch (err) {
        next(err);
    }
}
exports.default = {
    getUrlMonitorsByUser,
};
