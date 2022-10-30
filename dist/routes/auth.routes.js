"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const router = express_1.default.Router();
router.get("/login/success", (req, res) => {
    console.log(req.user);
    if (req.user) {
        res.json({
            success: true,
            message: "User has successfully authenticates",
            user: req.user,
            cookies: req.cookies,
        });
    }
    else {
        res.status(400).send("Not authenticated :-(");
    }
});
// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate.",
    });
});
// When logout, redirect to client
router.get("/logout", function (req, res, next) {
    req.logout({ keepSessionInfo: false }, function (err) {
        if (err) {
            return next(err);
        }
    });
    res.redirect(CLIENT_HOME_PAGE_URL + "/logout");
});
// auth with fb
router.get("/facebook", passport_1.default.authenticate("facebook"));
// redirect to home page after successfully login via twitter
// router.get(
//   "/facebook/redirect",
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_HOME_PAGE_URL,
//     failureRedirect: "/auth/login/failed",
//   })
// );
router.get("/facebook/redirect", passport_1.default.authenticate("facebook", { failureRedirect: "/auth/login/failed" }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(`http://localhost:3000/`);
});
exports.default = router;
