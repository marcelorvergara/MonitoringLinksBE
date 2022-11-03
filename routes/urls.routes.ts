import express, { NextFunction, Request, Response } from "express";
import UrlController from "../controllers/urls.controller";

const router = express.Router();

router.post("/", UrlController.createUrlMonitor);
router.get("/:id", UrlController.getUrlMonitor);

router.use((err: any, req: Request, _res: Response, next: NextFunction) => {
  const errorStr = `Method ${req.method}; URL ${req.baseUrl}; Error msg: ${err.message}`;
  next(errorStr);
});

export default router;
