import { NextFunction, Request, Response } from "express";
import UrlStatusService from "../services/urlStatus.service";

async function getUrlMonitorsByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.params.id);
    console.log(parseInt(req.params.id, 22));
    res.send(await UrlStatusService.getUrlMonitorsByUser(req.params.id));
    logger.info(`GET /urls - User Id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

export default {
  getUrlMonitorsByUser,
};
