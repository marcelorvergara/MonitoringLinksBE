"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const urlStatus_repository_1 = __importDefault(require("../repository/urlStatus.repository"));
async function createUrlMonitor(url) {
    // test URL
    return await (0, helpers_1.testUrl)(url);
}
async function getUrlMonitorsByUser(user_id) {
    if (user_id) {
        return await urlStatus_repository_1.default.getUrlMonitorsByUser(user_id);
    }
}
exports.default = {
    createUrlMonitor,
    getUrlMonitorsByUser,
};
