import axios from "axios";
import { IUrl } from "../interfaces/IUrl";
import UrlStatusRepository from "../repository/urlStatus.repository";
import UrlsService from "../repository/urls.repository";

export async function testUrl(url: IUrl) {
  try {
    const resultArray = [];
    const startTime = new Date().getTime() / 1000;
    const result = await axios.get(url.url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const statusCode = result.status;
    const endTime = new Date().getTime() / 1000;
    const elapsedTime = endTime - startTime;
    if (
      result.status.toString().startsWith("2") ||
      result.status.toString().startsWith("3")
    ) {
      resultArray.push({
        status: statusCode,
        load_time: Math.round((elapsedTime + Number.EPSILON) * 100) / 100,
        url_id: -1,
        url: "",
      });
      // insert url in URLS table
      const resInsUrl = await UrlsService.createUrlMonitor(url);
      // insert url status in URL Status table
      resultArray[0].url_id = resInsUrl.url_id;
      // insert url
      const returnResult = await UrlStatusRepository.insertUrlStatus(
        resultArray
      );
      returnResult[0].url = resInsUrl.url;
      return returnResult[0];
    } else {
      return { error: "Invalid URL or firewall block rule" };
    }
  } catch (err) {
    return { error: "Invalid URL or firewall block rule" };
  }
}
