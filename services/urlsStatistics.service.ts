import UrlStatusRepository from "../repository/urlsStatistics.repository";

async function getUrlsStatisticsByUser(user_id?: string) {
  if (user_id) {
    return await UrlStatusRepository.getUrlsStatisticsByUser(user_id);
  }
}

async function getLastHour(user_id?: string) {
  if (user_id) {
    return await UrlStatusRepository.getLastHour(user_id);
  }
}

export default {
  getUrlsStatisticsByUser,
  getLastHour,
};
