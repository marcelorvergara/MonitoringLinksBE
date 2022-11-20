"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const router = express_1.default.Router();
dotenv_1.default.config();
const REDIRECT_URL = process.env.ENV_ARG === "DEV"
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
    }
    else {
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
        req.session.destroy;
        req.logout({ keepSessionInfo: false }, function (err) {
            if (err) {
                return next(err);
            }
        });
        res.send({ message: "Success" });
    }
    catch (err) {
        next(err);
    }
});
// auth with fb
router.get("/facebook", passport_1.default.authenticate("facebook"));
router.get("/facebook/redirect", passport_1.default.authenticate("facebook", {
    successRedirect: REDIRECT_URL,
    failureRedirect: "/auth/login/failed",
}));
// auth with google
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
router.get("/google/redirect", passport_1.default.authenticate("google", {
    successRedirect: REDIRECT_URL,
    failureRedirect: "/auth/login/failed",
}));
router.use((err, req, _res, next) => {
    const errorStr = `Method ${req.method}; URL ${req.baseUrl}; Error msg: ${err.message}`;
    next(errorStr);
});
exports.default = router;
