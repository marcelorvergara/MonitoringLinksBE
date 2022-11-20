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
    res.status(201).send(await UrlsService.createUrlMonitor(url));
    logger.info(`POST /urls - ${JSON.stringify(url)}`);
  } catch (err) {
    next(err);
  }
}

async function getUrls(req: Request, res: Response, next: NextFunction) {
  try {
    res.send(await UrlsService.getUrls(req.params.id));
    logger.info(`GET /urls - User Id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function deleteUrl(req: Request, res: Response, next: NextFunction) {
  try {
    res.send(await UrlsService.deleteUrl(req.params.id));
    logger.info(`DELETE /urls - Url Id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

export default {
  createUrlMonitor,
  getUrls,
  deleteUrl,
};
