import { IUrl } from "../interfaces/IUrl";
import UrlRepository from "../repository/urls.repository";

async function createUrlMonitor(url: IUrl) {
  return await UrlRepository.createUrlMonitor(url);
}

async function getUrlMonitors() {
  return await UrlRepository.getUrlMonitors();
}

export default {
  createUrlMonitor,
  getUrlMonitors,
};
