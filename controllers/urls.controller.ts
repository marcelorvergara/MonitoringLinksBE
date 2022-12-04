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
    if (!url.url || !url.user_id || !url.warning_th || !url.danger_th) {
      throw new Error(
        "Url, warning threshold, danger threshold and user Id must be provided!"
      );
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
    // cant set status 204 - fe doesnt convert json()
    res.send(await UrlsService.deleteUrl(req.params.id));
    logger.info(`DELETE /urls - Url Id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function updateUrl(req: Request, res: Response, next: NextFunction) {
  try {
    let url: IUrl = req.body;
    if (!url.url_id || !url.user_id || !url.warning_th || !url.danger_th) {
      throw new Error(
        "Id, user Id, warning threshold and danger threshold must be provided!"
      );
    }
    res.status(202).send(await UrlsService.updateUrl(url));
  } catch (err) {
    next(err);
  }
}

export default {
  createUrlMonitor,
  getUrls,
  deleteUrl,
  updateUrl,
};
