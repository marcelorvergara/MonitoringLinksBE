import { testUrl } from "../helpers/helpers";
import { IUrl } from "../interfaces/IUrl";
import UrlsRepository from "../repository/urls.repository";

async function createUrlMonitor(url: IUrl) {
  // test URL
  return await testUrl(url);
}

async function getUrlMonitors() {
  return await UrlsRepository.getUrlMonitors();
}

export default {
  createUrlMonitor,
  getUrlMonitors,
};
