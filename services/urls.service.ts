import { testUrl } from "../helpers/helpers";
import { IUrl } from "../interfaces/IUrl";
import UrlsRepository from "../repository/urls.repository";

async function createUrlMonitor(url: IUrl) {
  // test URL to insert
  return await testUrl(url);
}

async function getUrlMonitors() {
  return await UrlsRepository.getUrlMonitors();
}

async function getUrls(id: string) {
  return await UrlsRepository.getUrls(id);
}

async function deleteUrl(id: string) {
  return await UrlsRepository.deleteUrl(id);
}

export default {
  createUrlMonitor,
  getUrlMonitors,
  getUrls,
  deleteUrl,
};
