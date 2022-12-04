import { testUrl } from "../helpers/helpers";
import { IUrl } from "../interfaces/IUrl";
import UrlsRepository from "../repository/urls.repository";

async function createUrlMonitor(url: IUrl) {
  // limit to four urls
  const totUrls = await UrlsRepository.getUrls(url.user_id);
  if (totUrls.length > 3) {
    throw new Error("Limit of 4 URLs reached");
  }
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

async function updateUrl(url: IUrl) {
  return await UrlsRepository.updateUrl(url);
}

export default {
  createUrlMonitor,
  getUrlMonitors,
  getUrls,
  deleteUrl,
  updateUrl,
};
