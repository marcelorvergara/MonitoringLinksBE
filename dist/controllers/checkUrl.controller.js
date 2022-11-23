"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkUrl_service_1 = __importDefault(require("../services/checkUrl.service"));
async function checkUrlSvc(req, res, next) {
    try {
        // restrict access to cron job
        if (req.headers["x-appengine-cron"] === "true") {
            await checkUrl_service_1.default.checkUrlSvc();
            res.send("Checks are going to start");
            logger.info(`GET /checkUrl - Checking urls`);
        }
        else {
            res.status(401).send("Unauthorized");
            logger.info(`GET /checkUrl - Unauthorized`);
        }
    }
    catch (err) {
        next(err);
    }
}
exports.default = {
    checkUrlSvc,
};
