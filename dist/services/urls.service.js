"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const urls_repository_1 = __importDefault(require("../repository/urls.repository"));
async function createUrlMonitor(url) {
    // test URL
    return await (0, helpers_1.testUrl)(url);
}
async function getUrlMonitors() {
    return await urls_repository_1.default.getUrlMonitors();
}
exports.default = {
    createUrlMonitor,
    getUrlMonitors,
};
