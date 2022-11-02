import cron from "node-cron";
import UrlsService from "../services/urls.service";
import axios from "axios";
import UrlStatus from "../repository/urlStatus.repository";
import { IUrlStatus } from "../interfaces/IUrlStatus";

export default function startCron() {
  cron.schedule("* * * * *", async () => {
    const urlsToMonitor = await UrlsService.getUrlMonitors();
    const results: IUrlStatus[] = [];
    urlsToMonitor.forEach(async (urlObj) => {
      const startTime = new Date().getTime() / 1000;
      await axios.get(urlObj.url).then((response) => {
        const statusCode = response.status;
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
