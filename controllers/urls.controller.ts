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
    url = await UrlsService.createUrlMonitor(url);
    res.send(url);
    logger.info(`POST /urls - ${JSON.stringify(url)}`);
  } catch (err) {
    next(err);
  }
}

export default {
  createUrlMonitor,
};
