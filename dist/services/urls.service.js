"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const urls_repository_1 = __importDefault(require("../repository/urls.repository"));
async function createUrlMonitor(url) {
    // test URL to insert
    return await (0, helpers_1.testUrl)(url);
}
async function getUrlMonitors() {
    return await urls_repository_1.default.getUrlMonitors();
}
async function getUrls(id) {
    return await urls_repository_1.default.getUrls(id);
}
async function deleteUrl(id) {
    return await urls_repository_1.default.deleteUrl(id);
}
exports.default = {
    createUrlMonitor,
    getUrlMonitors,
    getUrls,
    deleteUrl,
};
