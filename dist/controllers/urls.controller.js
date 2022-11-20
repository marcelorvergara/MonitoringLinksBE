"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const urls_service_1 = __importDefault(require("../services/urls.service"));
async function createUrlMonitor(req, res, next) {
    try {
        let url = req.body;
        if (!url.url || !url.user_id) {
            throw new Error("Url and user Id must be provided!");
        }
        res.status(201).send(await urls_service_1.default.createUrlMonitor(url));
        logger.info(`POST /urls - ${JSON.stringify(url)}`);
    }
    catch (err) {
        next(err);
    }
}
async function getUrls(req, res, next) {
    try {
        res.send(await urls_service_1.default.getUrls(req.params.id));
        logger.info(`GET /urls - User Id ${req.params.id}`);
    }
    catch (err) {
        next(err);
    }
}
async function deleteUrl(req, res, next) {
    try {
        res.send(await urls_service_1.default.deleteUrl(req.params.id));
        logger.info(`DELETE /urls - Url Id ${req.params.id}`);
    }
    catch (err) {
        next(err);
    }
}
exports.default = {
    createUrlMonitor,
    getUrls,
    deleteUrl,
};
