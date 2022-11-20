import { testUrl } from "../helpers/helpers";
import { IUrl } from "../interfaces/IUrl";
import UrlStatusRepository from "../repository/urlStatus.repository";

async function createUrlMonitor(url: IUrl) {
  // test URL
  return await testUrl(url);
}

async function getUrlMonitorsByUser(user_id?: string) {
  if (user_id) {
    return await UrlStatusRepository.getUrlMonitorsByUser(user_id);
  }
}

export default {
  createUrlMonitor,
  getUrlMonitorsByUser,
};
