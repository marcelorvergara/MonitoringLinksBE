import { testUrl } from "../helpers/helpers";
import { IUrl } from "../interfaces/IUrl";
import UrlRepository from "../repository/urls.repository";

async function createUrlMonitor(url: IUrl) {
  // test URL
  const testResult = await testUrl(url.url);
  if (testResult === "ok") {
    return await UrlRepository.createUrlMonitor(url);
  }
  return testResult;
}

async function getUrlMonitors(user_id?: number) {
  if (user_id) {
    return await UrlRepository.getUrlMonitorsByUser(user_id);
  }
  return await UrlRepository.getUrlMonitors();
}

export default {
  createUrlMonitor,
  getUrlMonitors,
};
