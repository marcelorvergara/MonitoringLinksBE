import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

const REDIRECT_URL =
  process.env.ENV_ARG === "DEV"
    ? process.env.CLIENT_URL_DEV
    : process.env.CLIENT_URL_PRD;

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "User has successfully authenticates",
      user: req.user,
      cookies: req.cookies,
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
router.get("/facebook/logout", function (req, res, next) {
  try {
    req.logout({ keepSessionInfo: false }, function (err) {
      if (err) {
        return next(err);
      }
    });
    res.send({ message: "Success" });
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

router.use((err: any, req: Request, _res: Response, next: NextFunction) => {
  console.log("err", err);
  const errorStr = `Method ${req.method}; URL ${req.baseUrl}; Error msg: ${err.message}`;
  next(errorStr);
});

export default router;
