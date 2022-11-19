import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { CLIENT_URL } from "..";

const router = express.Router();

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

// redirect to home page after successfully login via twitter
// router.get(
//   "/facebook/redirect",
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_HOME_PAGE_URL,
//     failureRedirect: "/auth/login/failed",
//   })
// );

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", { failureRedirect: "/auth/login/failed" }),
  function (_req, res, next) {
    try {
      // Successful authentication, redirect home.
      res.redirect(CLIENT_URL!);
    } catch (err) {
      next(err);
    }
  }
);

router.use((err: any, req: Request, _res: Response, next: NextFunction) => {
  const errorStr = `Method ${req.method}; URL ${req.baseUrl}; Error msg: ${err.message}`;
  next(errorStr);
});

export default router;
