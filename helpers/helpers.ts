import axios from "axios";
import { IUrl } from "../interfaces/IUrl";
import UrlStatusRepository from "../repository/urlStatus.repository";
import UrlsService from "../repository/urls.repository";
import dotenv from "dotenv";

dotenv.config();

const WP_URL =
  process.env.ENV_ARG === "DEV"
    ? process.env.WP_URL_DEV
    : process.env.WP_URL_PRD;

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

export async function treatAlarm(
  elapsedTime: number,
  warning_th: string,
  danger_th: string,
  sms_whatsapp: string,
  url: string
) {
  if (
    elapsedTime > parseFloat(warning_th) &&
    elapsedTime < parseFloat(danger_th)
  ) {
    axios
      .post(WP_URL + "/messages", {
        number: sms_whatsapp,
        message: `${url
          .replace("https://", "")
          .replace(
            "http://",
            ""
          )} in warning state with load time of ${elapsedTime.toFixed(
          2
        )}s. \nVisit your dashboard and check your monitor.`,
      })
      .then(function (response) {
        if (response.status === 201) {
          logger.info("Warning alert sent to " + sms_whatsapp);
        }
      })
      .catch(function (error) {
        logger.error(error);
      });
  }
  if (elapsedTime > parseFloat(danger_th)) {
    axios
      .post(WP_URL + "/messages", {
        number: sms_whatsapp,
        message: `${url
          .replace("https://", "")
          .replace(
            "http://",
            ""
          )} in danger state with load time of ${elapsedTime.toFixed(
          2
        )}s. \nVisit your dashboard and check your monitor.`,
      })
      .then(function (response) {
        if (response.status === 201) {
          logger.info("Danger alert sent to " + sms_whatsapp);
        }
      })
      .catch(function (error) {
        logger.error(error);
      });
  }
}

export async function treatErrorAlarm(
  elapsedTime: number,
  sms_whatsapp: string,
  url: string,
  statusCode: number
) {
  axios.prototype(WP_URL + "/message", {
    number: sms_whatsapp,
    message: `ERROR ALERT - ${url} is failing with status code ${statusCode} and elapsed time ${elapsedTime}`,
  });
}
