import UrlsService from "../services/urls.service";
import axios from "axios";
import { IUrlStatus } from "../interfaces/IUrlStatus";
import { IUrl } from "../interfaces/IUrl";
import { treatAlarm, treatErrorAlarm } from "../helpers/helpers";
import UrlStatusRepository from "../repository/urlStatus.repository";

async function checkUrlSvc() {
  const urlsToMonitor = await UrlsService.getUrlMonitors();
  const results: IUrlStatus[] = [];

  for (const urlObj of urlsToMonitor) {
    const startTime = new Date().getTime() / 1000;

    try {
      const response = await axios.get(urlObj.url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const statusCode = response.status;
      const endTime = new Date().getTime() / 1000;
      const elapsedTime = endTime - startTime;

      if (urlObj.sms_whatsapp) {
        treatAlarm(
          elapsedTime,
          urlObj.warning_th,
          urlObj.danger_th,
          urlObj.sms_whatsapp,
          urlObj.url
        );
      }

      results.push({
        status: statusCode,
        load_time: Math.round((elapsedTime + Number.EPSILON) * 100) / 100,
        url_id: urlObj.url_id,
      });
    } catch (err: any) {
      if (err.response) {
        const statusCode = err.response.status;
        const endTime = new Date().getTime() / 1000;
        const elapsedTime = endTime - startTime;

        if (urlObj.sms_whatsapp) {
          treatErrorAlarm(
            elapsedTime,
            urlObj.sms_whatsapp,
            urlObj.url,
            statusCode
          );
        }

        results.push({
          status: statusCode,
          load_time: Math.round((elapsedTime + Number.EPSILON) * 100) / 100,
          url_id: urlObj.url_id,
        });
      } else {
        console.error("Unhandled error:", err);

        results.push({
          status: 408, // Request timeout
          load_time: 0,
          url_id: urlObj.url_id,
        });
      }
    }
  }

  await UrlStatusRepository.insertUrlStatus(results);
}

export default {
  checkUrlSvc,
};
