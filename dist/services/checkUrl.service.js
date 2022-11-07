"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const urls_service_1 = __importDefault(require("../services/urls.service"));
const axios_1 = __importDefault(require("axios"));
const urlStatus_repository_1 = __importDefault(require("../repository/urlStatus.repository"));
function startCron() {
    node_cron_1.default.schedule("*/10 * * * *", async () => {
        console.log("checking services");
        const urlsToMonitor = await urls_service_1.default.getUrlMonitors();
        const results = [];
        urlsToMonitor.forEach(async (urlObj) => {
            const startTime = new Date().getTime() / 1000;
            await axios_1.default
                .get(urlObj.url, { headers: { "User-Agent": "Mozilla/5.0" } })
                .then((response) => {
                const statusCode = response.status;
                const endTime = new Date().getTime() / 1000;
                const elapsedTime = endTime - startTime;
                results.push({
                    status: statusCode,
                    load_time: Math.round((elapsedTime + Number.EPSILON) * 100) / 100,
                    url_id: urlObj.url_id,
                });
            })
                .catch((err) => {
                console.log("ERROR", err.response);
                const statusCode = err.response.status;
                const endTime = new Date().getTime() / 1000;
                const elapsedTime = endTime - startTime;
                results.push({
                    status: statusCode,
                    load_time: Math.round((elapsedTime + Number.EPSILON) * 100) / 100,
                    url_id: urlObj.url_id,
                });
            });
            if (results.length === urlsToMonitor.length) {
                urlStatus_repository_1.default.insertUrlStatus(results);
            }
        });
    });
}
exports.default = startCron;
