"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUrl = void 0;
const axios_1 = __importDefault(require("axios"));
async function testUrl(url) {
    try {
        const result = await axios_1.default.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (result.status.toString().startsWith("2") ||
            result.status.toString().startsWith("3")) {
            return "ok";
        }
        else {
            return "error";
        }
    }
    catch (err) {
        return "error";
    }
}
exports.testUrl = testUrl;
