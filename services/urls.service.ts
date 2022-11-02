import { IUrl } from "../interfaces/IUrl";
import UrlRepository from "../repository/urls.repository";
async function createUrlMonitor(url: IUrl) {
  return await UrlRepository.createUrlMonitor(url);
}

export default {
  createUrlMonitor,
};
