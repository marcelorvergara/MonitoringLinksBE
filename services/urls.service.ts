import { testUrl } from "../helpers/helpers";
import { IUrl } from "../interfaces/IUrl";
import UrlRepository from "../repository/urls.repository";

async function createUrlMonitor(url: IUrl) {
  // test URL
  return await testUrl(url);
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
