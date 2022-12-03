import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
import UrlsService from "../services/urls.service";

const router = express.Router();

dotenv.config();

const REDIRECT_URL =
  process.env.ENV_ARG === "DEV"
    ? process.env.CLIENT_URL_DEV
    : process.env.CLIENT_URL_PRD;

router.get("/login/success", async (req, res) => {
  if (req.user) {
    const user = req.user as IUser;
    const urls = await UrlsService.getUrls(user.id);
    res.json({
      success: true,
      message: "User has successfully authenticates",
      user: req.user,
      cookies: req.cookies,
      totUrls: urls.length,
    });
  } else {
    res.status(400).send("Not authenticated :-(");
  }
});

// when login failed, send failed msg
router.get("/login/failed", (_req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
});

// When logout, redirect to client
router.get("/logout", function (req, res, next) {
  try {
    res.cookie("session", "none", {
      expires: new Date(Date.now() + 4 * 1000),
      httpOnly: true,
    });
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  } catch (err) {
    next(err);
  }
});

// auth with fb
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", {
    successRedirect: REDIRECT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

// auth with google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: REDIRECT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

router.use((err: any, req: Request, _res: Response, next: NextFunction) => {
  const errorStr = `Method ${req.method}; URL ${req.baseUrl}; Error msg: ${err.message}`;
  next(errorStr);
});

export default router;
