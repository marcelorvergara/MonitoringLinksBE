import { NextFunction, Request, Response } from "express";
import UrlsStatisticsService from "../services/urlsStatistics.service";

async function getUrlsStatisticsByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.send(
      await UrlsStatisticsService.getUrlsStatisticsByUser(req.params.id)
    );
    logger.info(`GET /statistics - User Id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function getLastSixHour(req: Request, res: Response, next: NextFunction) {
  try {
    res.send(await UrlsStatisticsService.getLastSixHour(req.params.id));
    logger.info(`GET /statistics/lastDay - User Id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

export default {
  getUrlsStatisticsByUser,
  getLastSixHour,
};
