"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const __1 = require("..");
dotenv_1.default.config();
const router = express_1.default.Router();
const FacebookStrategy = require("passport-facebook").Strategy;
__1.app.use((0, express_session_1.default)({ secret: ".mys3cret.", resave: true, saveUninitialized: true }));
__1.app.use(passport_1.default.initialize());
__1.app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"],
}, function (accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken);
    return done(null, profile);
}));
__1.app.get("/", passport_1.default.authenticate("facebook"));
__1.app.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", { failureRedirect: "/failed" }), function (_req, res) {
    res.redirect("/profile");
});
__1.app.get("/failed", (req, res) => {
    res.send("Login failed");
});
__1.app.get("/profile", (req, res) => {
    res.send("Login success" + JSON.stringify(req.user));
});
// logout user
__1.app.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        res.clearCookie("connect.sid");
        res.send("Logout success");
    });
});
exports.default = router;
