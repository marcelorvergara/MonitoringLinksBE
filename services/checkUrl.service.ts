import cron from "node-cron";
import UrlsService from "../services/urls.service";
import axios from "axios";
import UrlStatus from "../repository/urlStatus.repository";
import { IUrlStatus } from "../interfaces/IUrlStatus";
import { IUrl } from "../interfaces/IUrl";

export default function startCron() {
  cron.schedule("*/10 * * * *", async () => {
    const urlsToMonitor = await UrlsService.getUrlMonitors();
    const results: IUrlStatus[] = [];
    urlsToMonitor.forEach(async (urlObj: IUrl) => {
      const startTime = new Date().getTime() / 1000;
      await axios
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
        UrlStatus.insertUrlStatus(results);
      }
    });
  });
}