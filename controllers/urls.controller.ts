import { Request, Response, NextFunction } from "express";
import { IUrl } from "../interfaces/IUrl";
import UrlsService from "../services/urls.service";

async function createUrlMonitor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let url: IUrl = req.body;
    if (!url.url || !url.user_id) {
      throw new Error("Url and user Id must be provided!");
    }
    res.send(await UrlsService.createUrlMonitor(url));
    logger.info(`POST /urls - ${JSON.stringify(url)}`);
  } catch (err) {
    next(err);
  }
}

async function getUrlMonitor(req: Request, res: Response, next: NextFunction) {
  try {
    res.send(await UrlsService.getUrlMonitors(parseInt(req.params.id)));
    logger.info(`GET /urls - User Id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

export default {
  createUrlMonitor,
  getUrlMonitor,
};
