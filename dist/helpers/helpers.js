"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const urlStatus_repository_1 = __importDefault(require("../repository/urlStatus.repository"));
const urls_repository_1 = __importDefault(require("../repository/urls.repository"));
async function testUrl(url) {
    try {
        const resultArray = [];
        const startTime = new Date().getTime() / 1000;
        const result = await axios_1.default.get(url.url, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });
        const statusCode = result.status;
        const endTime = new Date().getTime() / 1000;
        const elapsedTime = endTime - startTime;
        if (result.status.toString().startsWith("2") ||
            result.status.toString().startsWith("3")) {
            resultArray.push({
                status: statusCode,
                load_time: Math.round((elapsedTime + Number.EPSILON) * 100) / 100,
                url_id: -1,
            });
            // insert url in URLS table
            const resInsUrl = await urls_repository_1.default.createUrlMonitor(url);
            // insert url status in URL Status table
            resultArray[0].url_id = resInsUrl.url_id;
            const returnResult = await urlStatus_repository_1.default.insertUrlStatus(resultArray);
            return returnResult[0];
        }
        else {
            return { error: "Invalid URL or firewall block rule" };
        }
    }
    catch (err) {
        return { error: "Invalid URL or firewall block rule" };
    }
}
exports.testUrl = testUrl;
