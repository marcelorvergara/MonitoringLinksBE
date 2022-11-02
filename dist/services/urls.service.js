"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const urls_repository_1 = __importDefault(require("../repository/urls.repository"));
async function createUrlMonitor(url) {
    return await urls_repository_1.default.createUrlMonitor(url);
}
async function getUrlMonitors() {
    return await urls_repository_1.default.getUrlMonitors();
}
exports.default = {
    createUrlMonitor,
    getUrlMonitors,
};
