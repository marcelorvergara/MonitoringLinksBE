import express, { NextFunction, Request, Response } from "express";
import CheckUrl from "../controllers/checkUrl.controller";

const router = express.Router();

router.get("/", CheckUrl.checkUrlSvc);

export default router;
