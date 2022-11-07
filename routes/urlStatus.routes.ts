import express, { NextFunction, Request, Response } from "express";
import UrlStatusController from "../controllers/urlStatus.controller";

const router = express.Router();

router.get("/:id", UrlStatusController.getUrlMonitorsByUser);

router.use((err: any, req: Request, _res: Response, next: NextFunction) => {
  const errorStr = `Method ${req.method}; URL ${req.baseUrl}; Error msg: ${err.message}`;
  next(errorStr);
});

export default router;
